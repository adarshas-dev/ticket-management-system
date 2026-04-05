package com.example.ticketing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {

    private Long ticketId;
    private Long agentId;
    private String message;
}