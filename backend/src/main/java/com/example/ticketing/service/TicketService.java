package com.example.ticketing.service;

import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.model.*;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    //create ticket
    public Ticket createTicket(Ticket ticket){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setCreatedBy(user);
        ticket.setStatus(TicketStatus.OPEN);
        if (ticket.getPriority() == null) {
            ticket.setPriority(Priority.MEDIUM);
        }

        return ticketRepository.save(ticket);
    }

    //view ticket
    public List<Ticket> getTicketsForLoggedInUser(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ticketRepository.findByCreatedBy(user);
    }

    //assign ticket to agent
    public Ticket assignTicket(Long ticketId, Long agentId){
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(()->new ResourceNotFoundException("Ticket not found"));

        User agent = userRepository.findById(agentId).orElseThrow(()->new ResourceNotFoundException("Agent not found"));

        if(agent.getRole() != Role.AGENT){
            throw new RuntimeException("User is not an agent");
        }

        ticket.setAssignedAgent(agent);
        ticket.setStatus(TicketStatus.IN_PROGRESS);

        return ticketRepository.save(ticket);
    }

    //view assigned tickets
    public List<Ticket> getTicketsForAgent(String email){
        User agnet = userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("Agent not found"));

        return ticketRepository.findByAssignedAgent(agnet);
    }

    //update status
    public Ticket updateStatus(Long ticketId, TicketStatus status){
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(()->new ResourceNotFoundException("Ticket not found"));

        ticket.setStatus(status);
        return ticketRepository.save(ticket);
    }


    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElseThrow(()-> new RuntimeException("Ticket not found"));
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getAssignedTicketsByStatus(String email, TicketStatus status) {

        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        return ticketRepository.findByAssignedAgentAndStatus(agent, status);
    }
}
