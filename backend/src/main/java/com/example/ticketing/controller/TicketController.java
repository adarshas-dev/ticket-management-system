package com.example.ticketing.controller;

import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.service.TicketService;
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
    @PostMapping("/create/{userId}")
    public Ticket createTicket(@PathVariable Long userId, @RequestBody Ticket ticket){
        return ticketService.createTicket(userId, ticket);
    }

    //view own ticket
    @GetMapping("/user/{userId}")
    public List<Ticket> getUserTickets(@PathVariable Long userId){
        return ticketService.getTicketsByUser(userId);
    }

    //assign ticket
    @PutMapping("/{ticketId}/assign/{agentId}")
    public Ticket assignTicket(@PathVariable Long ticketId, @PathVariable Long agentId){
        return ticketService.assignTicket(ticketId, agentId);
    }

    //view assigned ticket
    @GetMapping("/agent/{agentId}")
    public List<Ticket> getAgentTickets(@PathVariable Long agentId){
        return ticketService.getTicketsForAgent(agentId);
    }

    //update status
    @PutMapping("/{ticketId}/status")
    public Ticket updateStatus(@PathVariable Long ticketId, @RequestParam TicketStatus status){
        return ticketService.updateStatus(ticketId, status);
    }


}
