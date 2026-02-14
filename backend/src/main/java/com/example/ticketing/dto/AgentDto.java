package com.example.ticketing.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AgentDto {

    private Long id;
    private String name;
    private String email;

    public AgentDto(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
}
