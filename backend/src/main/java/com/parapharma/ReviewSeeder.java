package com.parapharma;

import com.parapharma.entity.Product;
import com.parapharma.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReviewSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking if we need to seed random reviews for products...");
        List<Product> products = productRepository.findAll();
        Random random = new Random();
        int updatedCount = 0;

        for (Product product : products) {
            if (product.getReviewCount() == null || product.getReviewCount() == 0) {
                // Generate a random number of reviews between 10 and 150
                int randomReviews = 10 + random.nextInt(141);
                // Generate a random rating between 3.5 and 5.0
                double randomRating = 3.5 + (random.nextDouble() * 1.5);

                product.setReviewCount(randomReviews);
                product.setRating(Math.round(randomRating * 10.0) / 10.0);
                productRepository.save(product);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            log.info("Successfully seeded random reviews for {} products.", updatedCount);
        } else {
            log.info("No products needed random reviews seeding.");
        }
    }
}
