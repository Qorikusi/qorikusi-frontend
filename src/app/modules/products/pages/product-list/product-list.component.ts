import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  material: string;
  category: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = '';
  priceMin: number = 0;
  priceMax: number = 2900;

  // Filtros de Material
  materials = [
    { id: 1, name: 'Plata', count: 5, checked: true },
    { id: 2, name: 'Oro 18k', count: 1, checked: false }
  ];

  // Filtros de Detalles
  details = [
    { id: 1, name: 'Cuarzo' },
    { id: 2, name: 'Perlas' },
    { id: 3, name: 'Cristales' },
    { id: 4, name: 'Piedras' }
  ];

  // Productos (datos temporales)
  allProducts: Product[] = [
    {
      id: 1,
      name: 'Collar charm Itana Bela',
      price: 200.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Itana',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 2,
      name: 'Collar Carobela',
      price: 200.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Carobela',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 3,
      name: 'Corazón',
      price: 200.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Corazon',
      material: 'Oro 18k',
      category: 'Collares'
    },
    {
      id: 4,
      name: 'Collar Inti',
      price: 180.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Inti',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 5,
      name: 'Collar Luna',
      price: 220.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Luna',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 6,
      name: 'Collar Estrella',
      price: 250.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Estrella',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 7,
      name: 'Collar Chakana',
      price: 195.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Chakana',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 8,
      name: 'Collar Pacha',
      price: 210.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Pacha',
      material: 'Plata',
      category: 'Collares'
    },
    {
      id: 9,
      name: 'Collar Apu',
      price: 230.00,
      image: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Apu',
      material: 'Plata',
      category: 'Collares'
    }
  ];

  filteredProducts: Product[] = [];

  ngOnInit() {
    this.filteredProducts = [...this.allProducts];
  }

  onFilterChange() {
    // Aquí implementarías la lógica de filtrado
    console.log('Filtros cambiados');
  }

  onSortChange() {
    switch(this.sortBy) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        this.filteredProducts = [...this.allProducts];
    }
  }
}
