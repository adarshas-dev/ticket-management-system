package com.example.ticketing.repository;

import com.example.ticketing.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportedAgentId(Long agentId);
    Long countByIsReadFalse();
    List<Report> findByIsReadFalse();
    List<Report> findByResolvedFalse();
    long countByIsReadFalseAndResolvedFalse();
    List<Report> findByIsReadFalseAndResolvedFalse();
}
