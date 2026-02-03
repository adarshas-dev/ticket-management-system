package com.example.ticketing.controller;

import com.example.ticketing.dto.LoginRequest;
import com.example.ticketing.dto.RegisterRequest;
import com.example.ticketing.model.User;
import com.example.ticketing.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}
