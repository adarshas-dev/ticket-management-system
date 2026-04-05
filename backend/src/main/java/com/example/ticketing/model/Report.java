package com.example.ticketing.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private User reportedAgent;
    @ManyToOne
    private User reportedBy;
    @ManyToOne
    private Ticket ticket;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead = false;
    private boolean resolved = false;
}
