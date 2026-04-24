package com.example.ticketing.controller;

import com.example.ticketing.dto.AgentDto;
import com.example.ticketing.dto.NewAdminAgentDto;
import com.example.ticketing.dto.UserResponseDto;
import com.example.ticketing.dto.UserStatsDto;
import com.example.ticketing.exception.BadRequestException;
import com.example.ticketing.exception.ResourceNotFoundException;
import com.example.ticketing.model.Role;
import com.example.ticketing.model.Ticket;
import com.example.ticketing.model.TicketStatus;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.TicketRepository;
import com.example.ticketing.repository.UserRepository;
import com.example.ticketing.security.MailService;
import com.example.ticketing.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketService ticketService;
    private final TicketRepository ticketRepository;
    private final MailService mailService;


    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder, TicketService ticketService, TicketRepository ticketRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.ticketService = ticketService;
        this.ticketRepository = ticketRepository;
        this.mailService = mailService;
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
//    @PostMapping("/create-user")
//    public User createUser(@RequestBody NewAdminAgentDto request) {
//
//        if (request.getRole() == null)
//            throw new RuntimeException("Role is required");
//
//        if (userRepository.findByEmail(request.getEmail()).isPresent())
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
//
//        if (request.getRole() == Role.USER)
//            throw new RuntimeException("Cannot create USER here");
//
//        User user = new User();
//        user.setName(request.getName());
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setRole(request.getRole());
//
//
//        return userRepository.save(user);
//    }
    @PostMapping("/create-user")
    public User createUser(@RequestBody NewAdminAgentDto request) {

        if (request.getRole() == null)
            throw new RuntimeException("Role is required");

        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");

        if (request.getRole() == Role.USER)
            throw new RuntimeException("Cannot create USER here");

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        mailService.sendEmail(
                user.getEmail(),
                "Your account has been created",
                "Hello " + user.getName() + ",\n\n" +
                        "Your account has been created.\n" +
                        "Email: " + user.getEmail() + "\n" +
                        "Temporary Password: " + tempPassword + "\n\n" +
                        "Please login and change your password."
        );

        return savedUser;
    }

    //admin manages user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/active")
    public List<UserResponseDto> getActiveUsers() {

        User currentAdmin = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return userRepository.findByActiveTrue()
                .stream()
                .filter(user -> !user.getId().equals(currentAdmin.getId()))
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.isActive()
                ))
                .toList();
    }

    //admin inactive users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/inactive")
    public List<UserResponseDto> getInactiveUsers() {

        User currentAdmin = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return userRepository.findByActiveFalse()
                .stream()
                .filter(user -> !user.getId().equals(currentAdmin.getId()))
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.isActive()
                ))
                .toList();
    }

    //admin gets user details
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    //admin gets agent/admin stats
    @GetMapping("/users/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public UserStatsDto getUserStats(@PathVariable Long id) {
        return ticketService.getUserStats(id);
    }

//    //admin can delete user(admin/agent)
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/users/{id}")
//    public void deleteUser(@PathVariable Long id,
//                           Authentication authentication) {
//
//        User currentAdmin = (User) authentication.getPrincipal();
//
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (user.getId().equals(currentAdmin.getId())) {
//            throw new RuntimeException("You cannot delete yourself");
//        }
//
//        if (user.getRole() == Role.USER) {
//            throw new RuntimeException("Cannot delete normal users here");
//        }
//
//        userRepository.delete(user);
//    }

    //admin can suspend or activate the user
    @PutMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDto toggleUserStatus(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Boolean> body
    ) {

        boolean autoAssign = body != null && Boolean.TRUE.equals(body.get("autoAssign"));

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean becomingInactive = user.isActive();

        //admin suspend
        if (user.isActive() && user.getRole() == Role.AGENT) {

            long activeAgentCount = userRepository
                    .findByRoleAndActiveTrue(Role.AGENT)
                    .size();

            if (activeAgentCount <= 1) {
                throw new BadRequestException("Cannot suspend the last active agent");
            }
        }
        //toggle status
        user.setActive(!user.isActive());
        userRepository.save(user);

        //user suspend
        if (becomingInactive && user.getRole() == Role.USER) {

            List<Ticket> tickets = ticketRepository.findByCreatedBy(user);

            for (Ticket t : tickets) {

                if (t.getStatus() == TicketStatus.OPEN ||
                        t.getStatus() == TicketStatus.IN_PROGRESS) {

                    t.setStatus(TicketStatus.CLOSED);
                    t.setAssignedAgent(null);
                }
            }

            ticketRepository.saveAll(tickets);
        }
        //agent suspend
        if (becomingInactive && autoAssign && user.getRole() == Role.AGENT) {

            List<Ticket> tickets = ticketRepository.findByAssignedAgent(user);

            List<User> activeAgents = userRepository
                    .findByRoleAndActiveTrue(Role.AGENT)
                    .stream()
                    .filter(a -> !a.getId().equals(user.getId()))
                    .toList();

            if (activeAgents.isEmpty()) {
                throw new BadRequestException("No other active agents available for reassignment");
            }

            int index = 0;

            for (Ticket t : tickets) {

                // skip already closed tickets
                if (t.getStatus() == TicketStatus.CLOSED) continue;

                User newAgent = activeAgents.get(index % activeAgents.size());

                t.setAssignedAgent(newAgent);

                index++;
            }

            ticketRepository.saveAll(tickets);
        }

        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isActive()
        );
    }

    //auto assign ticket to agents
    @PutMapping("/tickets/auto-assign")
    @PreAuthorize("hasRole('ADMIN')")
    public String autoAssignTickets() {
        ticketService.autoAssignTickets();
        return "Tickets assigned successfully";
    }

    //admin can see user tickets
    @GetMapping("/users/{id}/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getUserTickets(@PathVariable Long id) {
        return ticketService.getTicketsByUser(id);
    }

}
