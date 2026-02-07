package com.example.ticketing.service;

import com.example.ticketing.dto.DashboardStatsResponse;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.repository.TicketRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final TicketRepository ticketRepository;

    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
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


}
