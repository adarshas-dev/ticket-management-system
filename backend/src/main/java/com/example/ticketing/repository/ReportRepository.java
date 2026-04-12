package com.example.ticketing.repository;

import com.example.ticketing.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportedAgentId(Long agentId);
    Long countByReadFalse();
    List<Report> findByReadFalse();
    List<Report> findByResolvedFalse();
    long countByReadFalseAndResolvedFalse();
    List<Report> findByReadFalseAndResolvedFalse();
}
