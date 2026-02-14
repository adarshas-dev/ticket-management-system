package com.example.ticketing.controller;

import com.example.ticketing.dto.AgentDto;
import com.example.ticketing.dto.DashboardStatsResponse;
import com.example.ticketing.model.Role;
import com.example.ticketing.model.User;
import com.example.ticketing.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public DashboardStatsResponse getStats(){
        return dashboardService.getStats();
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/agent-stats")
    public Map<String, Long> getAgentStats(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return dashboardService.getStatsForAgent(user.getEmail());
    }


}
