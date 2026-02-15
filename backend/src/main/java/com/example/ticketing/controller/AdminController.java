package com.example.ticketing.controller;

import com.example.ticketing.dto.AgentDto;
import com.example.ticketing.dto.NewAdminAgentDto;
import com.example.ticketing.dto.UserResponseDto;
import com.example.ticketing.model.Role;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

//get agent details
    @GetMapping("/agents")
    public List<AgentDto> getAgents() {
        return userRepository.findByRole(Role.AGENT)
                .stream()
                .map(user -> new AgentDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                ))
                .toList();
    }

    //create new admin or agent
        @PostMapping("/create-user")
        public User createUser(@RequestBody NewAdminAgentDto request) {

            if(request.getRole() == null)
                throw new RuntimeException("Role is required");

            if(userRepository.findByEmail(request.getEmail()).isPresent())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");

            if(request.getRole() == Role.USER)
                throw new RuntimeException("Cannot create USER here");

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());


            return userRepository.save(user);
        }

        //admin manages user(admin and agent)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<UserResponseDto> getAllAdminsAndAgents() {

        return userRepository.findByRoleIn(List.of(Role.ADMIN, Role.AGENT))
                .stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .toList();
    }

    //admin can delete user(admin/agent)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id,
                           Authentication authentication) {

        User currentAdmin = (User) authentication.getPrincipal();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getId().equals(currentAdmin.getId())) {
            throw new RuntimeException("You cannot delete yourself");
        }

        if (user.getRole() == Role.USER) {
            throw new RuntimeException("Cannot delete normal users here");
        }

        userRepository.delete(user);
    }


}
