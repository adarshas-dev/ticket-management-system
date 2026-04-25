package com.example.ticketing.controller;

import com.example.ticketing.dto.AuthResponse;
import com.example.ticketing.dto.LoginRequest;
import com.example.ticketing.dto.RegisterRequest;
import com.example.ticketing.model.User;
import com.example.ticketing.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body
    ) {

        authService.changePassword(
                body.get("currentPassword"),
                body.get("newPassword")
        );

        return ResponseEntity.ok("Password updated");
    }
}
