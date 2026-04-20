package com.parapharma.service;

import com.parapharma.dto.ProductCreateDTO;
import com.parapharma.dto.ProductDTO;
import com.parapharma.dto.ProductFilterDTO;
import com.parapharma.entity.Category;
import com.parapharma.entity.Product;
import com.parapharma.entity.ProductImage;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.mapper.ProductMapper;
import com.parapharma.repository.CategoryRepository;
import com.parapharma.repository.ProductRepository;
import com.parapharma.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProducts(ProductFilterDTO filter) {
        Sort sort = Sort.by(
                filter.getSortDir().equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                filter.getSortBy());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Page<Product> products = productRepository.findAll(
                ProductSpecification.withFilters(
                        filter.getKeyword(),
                        filter.getCategoryId(),
                        filter.getManufacturer(),
                        filter.getMinPrice(),
                        filter.getMaxPrice(),
                        filter.getMinRating(),
                        filter.getInStock()),
                pageable);

        return products.map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "slug", slug));
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", id));
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.search(query, pageable).map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getRelatedProducts(String slug, int limit) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "slug", slug));
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> related = productRepository.findRelatedProducts(
                product.getCategory().getId(), product.getId(), pageable);
        return productMapper.toDTOList(related);
    }

    @Transactional(readOnly = true)
    public List<String> getAllManufacturers() {
        return productRepository.findAllManufacturers();
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getLatestProducts(int page, int size) {
        return productRepository.findLatestProducts(PageRequest.of(page, size))
                .map(productMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getTopRatedProducts(int page, int size) {
        return productRepository.findTopRatedProducts(PageRequest.of(page, size))
                .map(productMapper::toDTO);
    }

    public ProductDTO createProduct(ProductCreateDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", dto.getCategoryId()));

        String slug = generateSlug(dto.getTitle());

        Product product = Product.builder()
                .title(dto.getTitle())
                .slug(slug)
                .price(dto.getPrice())
                .rating(dto.getRating() != null ? dto.getRating() : 0.0)
                .description(dto.getDescription())
                .usageTips(dto.getUsageTips())
                .manufacturer(dto.getManufacturer())
                .category(category)
                .stockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    public ProductDTO updateProduct(Long id, ProductCreateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", dto.getCategoryId()));

        product.setTitle(dto.getTitle());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setUsageTips(dto.getUsageTips());
        product.setManufacturer(dto.getManufacturer());
        product.setCategory(category);
        product.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : product.getStockQuantity());
        product.setRating(dto.getRating() != null ? dto.getRating() : product.getRating());
        product.setActive(dto.getActive() != null ? dto.getActive() : product.getActive());

        if (!product.getTitle().equals(dto.getTitle())) {
            product.setSlug(generateSlug(dto.getTitle()));
        }

        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produit", "id", id);
        }
        productRepository.deleteById(id);
    }

    public ProductDTO addImageToProduct(Long productId, String imageUrl, boolean isPrimary) {
        log.info("Liaison de l'image {} au produit ID: {} (Primaire: {})", imageUrl, productId, isPrimary);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));

        if (isPrimary) {
            log.debug("Réinitialisation des images primaires pour le produit : {}", productId);
            product.getImages().forEach(img -> img.setIsPrimary(false));
        }

        ProductImage image = ProductImage.builder()
                .imageUrl(imageUrl)
                .displayOrder(product.getImages().size())
                .isPrimary(isPrimary)
                .build();

        product.addImage(image);
        Product saved = productRepository.save(product);
        log.info("Image ajoutée avec succès. Nombre total d'images : {}", saved.getImages().size());
        return productMapper.toDTO(saved);
    }

    public ProductDTO removeImageFromProduct(Long productId, Long imageId) {
        log.info("Suppression de l'image ID: {} du produit ID: {}", imageId, productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit", "id", productId));

        ProductImage imageToRemove = product.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Image", "id", imageId));

        // Delete the physical file from disk
        fileStorageService.deleteFile(imageToRemove.getImageUrl());

        product.removeImage(imageToRemove);
        Product saved = productRepository.save(product);
        log.info("Image supprimée de la base de données. ID: {}", imageId);
        return productMapper.toDTO(saved);
    }

    private String generateSlug(String title) {
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        // Ensure uniqueness
        String baseSlug = slug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        return slug;
    }
}
