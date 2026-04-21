package com.example.ticketing.controller;

import com.example.ticketing.model.*;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin
public class TicketController {
    private final TicketService ticketService;
    private final TicketRepository ticketRepository;

    public TicketController(TicketService ticketService, TicketRepository ticketRepository) {
        this.ticketService = ticketService;
        this.ticketRepository = ticketRepository;
    }

    //create ticket
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public Ticket createTicket(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) MultipartFile file
    ) throws IOException {

        return ticketService.createTicket(title, description, priority, file);
    }

    //view own ticket
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public List<Ticket> getUserTickets(){

        return ticketService.getTicketsForLoggedInUser();
    }

    @GetMapping("/my/status/{status}")
    public List<Ticket> getMyTicketsByStatus(
            @PathVariable TicketStatus status
    ) {
        return ticketService.getMyTicketsByStatus(status);
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id){
        return ticketService.getTicketById(id);
    }

    //assign ticket
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{ticketId}/assign/{agentId}")
    public Ticket assignTicket(@PathVariable Long ticketId, @PathVariable Long agentId){
        return ticketService.assignTicket(ticketId, agentId);
    }

    //view assigned ticket
    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/assigned")
    public List<Ticket> getAgentTickets(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

//        System.out.println("Controller HIT");
//        System.out.println("Email = " + user.getEmail());

        return ticketService.getTicketsForAgent(user.getEmail());
    }

    //update status
    @PreAuthorize("hasRole('AGENT')")
    @PutMapping("/{ticketId}/status")
    public Ticket updateStatus(@PathVariable Long ticketId, @RequestParam TicketStatus status){
        return ticketService.updateStatus(ticketId, status);
    }

    //get the tickets according to the status
    @PreAuthorize("hasAnyRole('ADMIN','AGENT', 'USER')")
    @GetMapping("/status/{status}")
    public List<Ticket> getTicketsByStatus(@PathVariable TicketStatus status) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();

        if (user.getRole() == Role.ADMIN) {
            return ticketService.getTicketsByStatus(status);
        }

        return ticketService.getTicketsByStatusForAgent(status, user);
    }

//    gets assigned tickets for the agent in the sidebar
    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/assigned/status/{status}")
    public List<Ticket> getAssignedTicketsByStatus(
            @PathVariable TicketStatus status,
            Authentication authentication
    ) {
        User agent = (User) authentication.getPrincipal();
        return ticketService.getAssignedTicketsByStatus(agent.getEmail(), status);
    }

    //agent priority ticket
    @GetMapping("/agent/priority-tickets")
    @PreAuthorize("hasRole('AGENT')")
    public List<Ticket> getPriorityTickets() {

        User agent = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ticketRepository
                .findTop3ByAssignedAgentAndPriorityInAndStatusInOrderByCreatedAtAsc(
                        agent,
                        List.of(Priority.URGENT, Priority.HIGH),
                        List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
                );
    }

    //agent notification
    @GetMapping("/agent/unread-count")
    @PreAuthorize("hasRole('AGENT')")
    public long unreadTickets(){
        User agent = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ticketRepository.countByAssignedAgentAndSeenByAgentFalse(agent);
    }

    @PutMapping("/agent/mark-seen")
    @PreAuthorize("hasRole('AGENT')")
    public void markSeen(){
        User agent = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        List<Ticket> tickets = ticketRepository.findByAssignedAgentAndSeenByAgentFalse(agent);
        tickets.forEach(t -> t.setSeenByAgent(true));
        ticketRepository.saveAll(tickets);
    }

    //pagination
    @GetMapping("/tickets")
    public Page<Ticket> getTickets(
            @RequestParam int page,
            @RequestParam int size
    ) {
        return ticketService.getTickets(page, size);
    }



}
