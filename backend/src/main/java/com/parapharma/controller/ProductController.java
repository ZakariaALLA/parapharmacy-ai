package com.parapharma.controller;

import com.parapharma.dto.ProductCreateDTO;
import com.parapharma.dto.ProductDTO;
import com.parapharma.dto.ProductFilterDTO;
import com.parapharma.service.FileStorageService;
import com.parapharma.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ProductFilterDTO filter = ProductFilterDTO.builder()
                .keyword(keyword)
                .categoryId(categoryId)
                .manufacturer(manufacturer)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .minRating(minRating)
                .inStock(inStock)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(productService.getProducts(filter));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDTO> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDTO>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.searchProducts(q, page, size));
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<List<ProductDTO>> getRelatedProducts(
            @PathVariable String slug,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(productService.getRelatedProducts(slug, limit));
    }

    @GetMapping("/manufacturers")
    public ResponseEntity<List<String>> getManufacturers() {
        return ResponseEntity.ok(productService.getAllManufacturers());
    }

    @GetMapping("/latest")
    public ResponseEntity<Page<ProductDTO>> getLatestProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(productService.getLatestProducts(page, size));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<Page<ProductDTO>> getTopRatedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {
        return ResponseEntity.ok(productService.getTopRatedProducts(page, size));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ProductDTO> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean primary) {
        String imageUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(productService.addImageToProduct(id, imageUrl, primary));
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    public ResponseEntity<ProductDTO> deleteImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(productService.removeImageFromProduct(productId, imageId));
    }
}
