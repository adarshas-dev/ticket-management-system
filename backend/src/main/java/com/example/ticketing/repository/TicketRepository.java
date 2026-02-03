package com.example.ticketing.repository;

import com.example.ticketing.TicketingApplication;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User user);
    List<Ticket> findByAssignedAgent(User agent);
    List<Ticket> findByStatus(TicketStatus status);
}
