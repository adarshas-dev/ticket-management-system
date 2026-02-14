package com.example.ticketing.service;

import com.example.ticketing.dto.DashboardStatsResponse;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final TicketRepository ticketRepository;
    private  final UserRepository userRepository;

    public DashboardService(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsResponse getStats(){
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgress = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closed = ticketRepository.countByStatus(TicketStatus.CLOSED);

        return new DashboardStatsResponse(
                total,open,inProgress,resolved,closed
        );
    }


        public Map<String, Long> getStatsForAgent(String email) {

            User agent = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            List<Ticket> tickets = ticketRepository.findByAssignedAgent(agent);

            long open = tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.OPEN)
                    .count();

            long inProgress = tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS)
                    .count();

            long resolved = tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.RESOLVED)
                    .count();

            long closed = tickets.stream()
                    .filter(t -> t.getStatus() == TicketStatus.CLOSED)
                    .count();

            Map<String, Long> stats = new HashMap<>();
            stats.put("openTickets", open);
            stats.put("inProgressTickets", inProgress);
            stats.put("resolvedTickets", resolved);
            stats.put("closedTickets", closed);

            return stats;
        }
    }
