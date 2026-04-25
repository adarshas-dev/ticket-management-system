package com.example.ticketing.controller;

import com.example.ticketing.dto.ReportRequest;
import com.example.ticketing.dto.ReportResponseDto;
import com.example.ticketing.model.Report;
import com.example.ticketing.repository.ReportRepository;
import com.example.ticketing.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final ReportRepository reportRepository;

    //create reports
    @PostMapping
    public void createReport(@RequestBody ReportRequest request) {
        reportService.createReport(request);
    }

    //get all reports
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReportResponseDto> getAllReports() {
        return reportRepository.findByResolvedFalse()
                .stream()
                .map(r -> new ReportResponseDto(
                        r.getId(),
                        r.getReportedBy().getName(),
                        r.getReportedAgent().getName(),
                        r.getTicket().getId(),
                        r.getMessage(),
                        r.getCreatedAt(),
                        r.getReportedAgent().getId(),
                        r.getReportedBy().getId()
                ))
                .toList();
    }

    //get reports in agent data
    @GetMapping("/agent/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReportResponseDto> getReportsByAgent(@PathVariable Long agentId) {
        return reportRepository.findByReportedAgentId(agentId)
                .stream()
                .map(r -> new ReportResponseDto(
                        r.getId(),
                        r.getReportedBy().getName(),
                        r.getReportedAgent().getName(),
                        r.getTicket().getId(),
                        r.getMessage(),
                        r.getCreatedAt(),
                        r.getReportedAgent().getId(),
                        r.getReportedBy().getId()

                ))
                .toList();
    }

    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public long getUnreadReportCount() {
        return reportRepository.countByReadFalseAndResolvedFalse();
    }

    @PutMapping("/mark-read")
    @PreAuthorize("hasRole('ADMIN')")
    public void martReportAsRead() {
        List<Report> reports = reportRepository.findByReadFalseAndResolvedFalse();
        for (Report r : reports) {
            r.setRead(true);
        }
        reportRepository.saveAll(reports);
    }

    //resolved reports
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public void resolveReport(@PathVariable Long id) {
        Report report = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("Report not found"));
        report.setResolved(true);
        reportRepository.save(report);
    }
}