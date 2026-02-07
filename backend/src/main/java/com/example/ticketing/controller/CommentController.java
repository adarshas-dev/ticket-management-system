package com.example.ticketing.controller;

import com.example.ticketing.model.Comment;
import com.example.ticketing.service.CommentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    //add comment
    @PreAuthorize("hasAnyRole('USER','AGENT')")
    @PostMapping("/ticket/{ticketId}")
    public Comment addComment(@PathVariable Long ticketId, @RequestBody Map<String, String> body){
        return commentService.addComment(ticketId, body.get("message"));
    }

    //view comment
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/ticket/{ticketId}")
    public List<Comment> getComments(@PathVariable Long ticketId){
        return commentService.getComments(ticketId);
    }


}
