package com.example.ticketing.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String to, String subject, String text) {
        try{
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("adarshasokakumar0@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }
    }
}
