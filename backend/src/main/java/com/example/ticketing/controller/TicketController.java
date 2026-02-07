package com.example.ticketing.controller;

import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.service.TicketService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    //create ticket
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/create")
    public Ticket createTicket(@RequestBody Ticket ticket){
        return ticketService.createTicket( ticket);
    }

    //view own ticket
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public List<Ticket> getUserTickets(){

        return ticketService.getTicketsForLoggedInUser();
    }

    //assign ticket
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{ticketId}/assign/{agentId}")
    public Ticket assignTicket(@PathVariable Long ticketId, @PathVariable Long agentId){
        return ticketService.assignTicket(ticketId, agentId);
    }

    //view assigned ticket
    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/agent/{agentId}")
    public List<Ticket> getAgentTickets(@PathVariable Long agentId){
        return ticketService.getTicketsForAgent(agentId);
    }

    //update status
    @PreAuthorize("hasRole('AGENT')")
    @PutMapping("/{ticketId}/status")
    public Ticket updateStatus(@PathVariable Long ticketId, @RequestParam TicketStatus status){
        return ticketService.updateStatus(ticketId, status);
    }


}
