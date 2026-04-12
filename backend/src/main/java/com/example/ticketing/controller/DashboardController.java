package com.example.ticketing.controller;

import com.example.ticketing.dto.AgentDto;
import com.example.ticketing.dto.DashboardStatsResponse;
import com.example.ticketing.model.Priority;
import com.example.ticketing.model.Role;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {
    private final DashboardService dashboardService;
    private final TicketRepository ticketRepository;

    public DashboardController(DashboardService dashboardService, TicketRepository ticketRepository) {
        this.dashboardService = dashboardService;
        this.ticketRepository = ticketRepository;
    }

    //admin stats
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public DashboardStatsResponse getStats() {
        return dashboardService.getStats();
    }

    //agent stats
    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/agent-stats")
    public Map<String, Long> getAgentStats(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return dashboardService.getStatsForAgent(user.getEmail());
    }

    //chart
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> getAnalytics() {

        Map<String, Object> data = new HashMap<>();

        data.put("open", ticketRepository.countByStatus(TicketStatus.OPEN));
        data.put("inProgress", ticketRepository.countByStatus(TicketStatus.IN_PROGRESS));
        data.put("resolved", ticketRepository.countByStatus(TicketStatus.RESOLVED));
        data.put("closed", ticketRepository.countByStatus(TicketStatus.CLOSED));

        data.put("urgent", ticketRepository.countByPriority(Priority.URGENT));
        data.put("high", ticketRepository.countByPriority(Priority.HIGH));
        data.put("medium", ticketRepository.countByPriority(Priority.MEDIUM));
        data.put("low", ticketRepository.countByPriority(Priority.LOW));

        return data;
    }


}
