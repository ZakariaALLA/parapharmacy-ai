package com.parapharma.controller;

import com.parapharma.dto.ProductDTO;
import com.parapharma.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getWishlist(authentication.getName()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> addToWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(Map.of("message", "Produit ajouté à la liste de souhaits"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/check")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            Authentication authentication,
            @PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(authentication.getName(), productId);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }
}
