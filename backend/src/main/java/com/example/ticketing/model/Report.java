package com.example.ticketing.model;

import jakarta.persistence.*;
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

    @Column(name = "is_read")
    private Boolean read = false;

    private Boolean resolved = false;
}
