package com.example.ticketing.service;

import com.example.ticketing.dto.ReportRequest;
import com.example.ticketing.exception.BadRequestException;
import com.example.ticketing.model.Report;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.ReportRepository;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public void createReport(ReportRequest request) {

        User currentUser = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new BadRequestException("Ticket not found"));

        User agent = userRepository.findById(request.getAgentId())
                .orElseThrow(() -> new BadRequestException("Agent not found"));

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new BadRequestException("Report message cannot be empty");
        }

        Report report = new Report();
        report.setReportedBy(currentUser);
        report.setReportedAgent(agent);
        report.setTicket(ticket);
        report.setMessage(request.getMessage());
        report.setCreatedAt(LocalDateTime.now());

        reportRepository.save(report);
        report.setRead(false);
    }
}