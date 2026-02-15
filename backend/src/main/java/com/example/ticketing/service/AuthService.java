package com.example.ticketing.service;

import com.example.ticketing.dto.AuthResponse;
import com.example.ticketing.dto.LoginRequest;
import com.example.ticketing.dto.RegisterRequest;
import com.example.ticketing.exception.BadRequestException;
import com.example.ticketing.model.Role;
import com.example.ticketing.model.User;
import com.example.ticketing.repository.UserRepository;
import com.example.ticketing.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(()-> new  BadRequestException("Invalid email"));
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new  BadRequestException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getName());
        return new AuthResponse(token);
    }
}
