package com.parapharma.service;

import com.parapharma.dto.ProductDTO;
import com.parapharma.entity.User;
import com.parapharma.entity.Product;
import com.parapharma.entity.WishlistItem;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.mapper.ProductMapper;
import com.parapharma.repository.ProductRepository;
import com.parapharma.repository.UserRepository;
import com.parapharma.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductDTO> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));

        return wishlistItemRepository.findByUserIdWithProducts(user.getId())
                .stream()
                .map(item -> productMapper.toDTO(item.getProduct()))
                .collect(Collectors.toList());
    }

    public void addToWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));

        if (wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalArgumentException("Ce produit est déjà dans votre liste de souhaits");
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        wishlistItemRepository.save(item);
    }

    public void removeFromWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));

        wishlistItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
        return wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
}
