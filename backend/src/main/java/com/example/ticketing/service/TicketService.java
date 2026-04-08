package com.example.ticketing.service;

import com.example.ticketing.dto.UserStatsDto;
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

    public UserStatsDto getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserStatsDto(
                ticketRepository.countByAssignedAgentAndStatus(user, TicketStatus.OPEN),
                ticketRepository.countByAssignedAgentAndStatus(user, TicketStatus.IN_PROGRESS),
                ticketRepository.countByAssignedAgentAndStatus(user, TicketStatus.RESOLVED),
                ticketRepository.countByAssignedAgentAndStatus(user, TicketStatus.CLOSED)
        );
    }

    public void autoAssignTickets() {

        //get all agents
//        List<User> agents = userRepository.findByRole(Role.AGENT);
        List<User> agents = userRepository.findByRoleAndActiveTrue(Role.AGENT);

        if (agents.isEmpty()) {
            throw new RuntimeException("No agents available");
        }

        //get all unassigned tickets
        List<Ticket> tickets = ticketRepository.findByAssignedAgentIsNullAndStatus(TicketStatus.OPEN);

        //sort based on priority
        tickets.sort((t1, t2) -> t2.getPriority().compareTo(t1.getPriority()));

        //using round robin
        int index = 0;

        for (Ticket ticket : tickets) {
            User agent = agents.get(index % agents.size());

            ticket.setAssignedAgent(agent);
            ticket.setStatus(TicketStatus.IN_PROGRESS);
            ticket.setSeenByAgent(false);

            index++;
        }

        ticketRepository.saveAll(tickets);
    }

    public List<Ticket> getTicketsByStatusForAgent(TicketStatus status, User agent) {
        return ticketRepository.findByStatusAndAssignedAgent(status, agent);
    }
}
