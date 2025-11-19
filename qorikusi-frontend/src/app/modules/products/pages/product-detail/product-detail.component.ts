import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  specs: string;
  images: string[];
  category: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  
  selectedImageIndex = 0;
  
  // Producto actual (datos temporales)
  product: Product = {
    id: 1,
    name: 'Collar Inti',
    price: 180.00,
    description: 'Collar de plata 925 con un cuarzo natural para canalizar energía y elegancia.',
    specs: 'Largo: 45 cm aprox',
    images: [
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+1',
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+2',
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+3'
    ],
    category: 'Collares'
  };

  // Productos recomendados
  recommendedProducts = [
    {
      id: 2,
      name: 'Dobleco oro',
      price: 180.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Dobleco+oro'
    },
    {
      id: 3,
      name: 'Aretes Moon',
      price: 200.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Aretes+Moon'
    },
    {
      id: 4,
      name: 'Collar Lua',
      price: 120.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Collar+Lua'
    },
    {
      id: 5,
      name: 'Diosa',
      price: 250.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Diosa'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el ID del producto de la ruta
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', productId);
    
    // Aquí cargarías el producto desde tu servicio
    // this.productService.getProductById(productId).subscribe(...)
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart() {
    console.log('Añadido al carrito:', this.product.name);
    alert(`"${this.product.name}" añadido al carrito`);
    // Aquí conectarás con tu servicio de carrito
  }

  buyNow() {
    console.log('Comprar ahora:', this.product.name);
    alert(`Redirigiendo a checkout con "${this.product.name}"`);
    // Aquí redirigirías al checkout
    // this.router.navigate(['/checkout']);
  }
}
