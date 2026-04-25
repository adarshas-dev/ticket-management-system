package com.example.ticketing.repository;

import com.example.ticketing.TicketingApplication;
import com.example.ticketing.model.Priority;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedBy(User user);

    List<Ticket> findByAssignedAgent(User agent);

    //    List<Ticket> findByStatus(TicketStatus status);
    long countByStatus(TicketStatus status);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByAssignedAgentAndStatus(User agent, TicketStatus status);

    long countByAssignedAgentAndStatus(User user, TicketStatus ticketStatus);

    List<Ticket> findByAssignedAgentIsNull();

    List<Ticket> findByAssignedAgentIsNullAndStatus(TicketStatus status);

    List<Ticket> findTop3ByAssignedAgentAndPriorityInAndStatusInOrderByCreatedAtAsc(
            User agent,
            List<Priority> priorities,
            List<TicketStatus> statuses
    );

    long countByAssignedAgentAndSeenByAgentFalse(User agent);

    List<Ticket> findByAssignedAgentAndSeenByAgentFalse(User agent);

    List<Ticket> findByStatusAndAssignedAgent(TicketStatus status, User agent);

    long countByPriority(Priority priority);

    long countByCreatedBy(User user);

    long countByCreatedByAndStatus(
            User user,
            TicketStatus status
    );

    List<Ticket> findByCreatedByAndStatus(
            User user,
            TicketStatus status
    );

    List<Ticket> findByCreatedByOrderByCreatedAtDesc(User user);
}
