package com.parapharma.service;

import com.parapharma.dto.CategoryDTO;
import com.parapharma.entity.Category;
import com.parapharma.exception.ResourceNotFoundException;
import com.parapharma.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllOrdered().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "slug", slug));
        return toDTO(category);
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Une catégorie avec ce nom existe déjà");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(generateSlug(dto.getName()))
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .build();

        return toDTO(categoryRepository.save(category));
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", id));

        category.setName(dto.getName());
        category.setSlug(generateSlug(dto.getName()));
        category.setDescription(dto.getDescription());
        category.setImageUrl(dto.getImageUrl());

        return toDTO(categoryRepository.save(category));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Catégorie", "id", id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        return normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
