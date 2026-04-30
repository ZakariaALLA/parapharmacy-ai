package com.parapharma.controller;

import com.parapharma.dto.ReviewCreateDTO;
import com.parapharma.dto.ReviewDTO;
import com.parapharma.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<?> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewCreateDTO dto,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Non autorisé");
        }
        
        try {
            ReviewDTO saved = reviewService.addReview(productId, authentication.getName(), dto);
            return ResponseEntity.ok(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
