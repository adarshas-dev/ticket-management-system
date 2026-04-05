package com.example.ticketing.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReportResponseDto {

    private Long id;
    private String reportedByName;
    private String agentName;
    private Long ticketId;
    private String message;
    private LocalDateTime createdAt;
    private Long agentId;
    private Long userId;
}