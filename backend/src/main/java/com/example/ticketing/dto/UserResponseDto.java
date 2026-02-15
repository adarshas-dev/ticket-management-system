package com.example.ticketing.dto;

import com.example.ticketing.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private Role role;

    public UserResponseDto(Long id, String name, String email, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

}
