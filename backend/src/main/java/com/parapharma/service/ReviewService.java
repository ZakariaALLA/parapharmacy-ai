package com.parapharma.service;

import com.parapharma.dto.ReviewCreateDTO;
import com.parapharma.dto.ReviewDTO;
import com.parapharma.entity.Product;
import com.parapharma.entity.Review;
import com.parapharma.entity.User;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.repository.ProductRepository;
import com.parapharma.repository.ReviewRepository;
import com.parapharma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ReviewDTO addReview(Long productId, String userEmail, ReviewCreateDTO dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", userEmail));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalStateException("Vous avez déjà noté ce produit.");
        }

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update product average rating
        int oldReviewCount = product.getReviewCount() != null ? product.getReviewCount() : 0;
        double oldRating = product.getRating() != null ? product.getRating() : 0.0;

        int newReviewCount = oldReviewCount + 1;
        double newRating = ((oldRating * oldReviewCount) + dto.getRating()) / newReviewCount;

        product.setReviewCount(newReviewCount);
        product.setRating(Math.round(newRating * 10.0) / 10.0);
        productRepository.save(product);

        return toDTO(savedReview);
    }

    private ReviewDTO toDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
