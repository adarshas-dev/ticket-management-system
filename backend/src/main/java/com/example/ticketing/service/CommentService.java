package com.example.ticketing.service;

import com.example.ticketing.exception.BadRequestException;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.model.Comment;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.CommentRepository;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, TicketRepository ticketRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    //for user/agent add comment
    public Comment addComment(Long ticketId, String message) {

        if (message == null || message.trim().isEmpty()) {
            throw new BadRequestException("Comment message cannot be empty");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new BadRequestException("Cannot comment on closed ticket");
        }

        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setUser(user);
        comment.setMessage(message);

        return commentRepository.save(comment);
    }

    //view comments
    public List<Comment> getComments(Long ticketId){
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(()->new ResourceNotFoundException("Ticket not found"));

        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket);
    }

}
