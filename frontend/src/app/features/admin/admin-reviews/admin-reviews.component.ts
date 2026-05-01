import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductService, Review } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';
  deletingReviewId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.error = '';
    this.productService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des avis.';
        this.loading = false;
        console.error('Error loading reviews', err);
      }
    });
  }

  deleteReview(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.')) {
      this.deletingReviewId = id;
      this.productService.deleteReviewAdmin(id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== id);
          this.deletingReviewId = null;
        },
        error: (err) => {
          console.error('Error deleting review', err);
          this.deletingReviewId = null;
          alert('Erreur lors de la suppression de l\'avis.');
        }
      });
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}
