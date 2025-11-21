import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  specs?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  shippingCost: number = 15.0;

  ngOnInit() {
    // Cargar items del carrito (simulación con datos de ejemplo)
    this.loadCartItems();
  }

  loadCartItems() {
    // Aquí cargarías los items desde tu servicio de carrito
    // Por ahora, simulamos algunos productos
    this.cartItems = [
      {
        product: {
          id: 1,
          name: 'Collar Inti',
          price: 180.0,
          image:
            'https://via.placeholder.com/150x150/f5f3f0/3d3d5c?text=Collar+Inti',
          specs: 'Plata 925, 45 cm',
        },
        quantity: 2,
      },
      {
        product: {
          id: 2,
          name: 'Anillo Lunar',
          price: 200.0,
          image:
            'https://via.placeholder.com/150x150/f5f3f0/3d3d5c?text=Anillo+Lunar',
          specs: 'Oro 18k, Talla 7',
        },
        quantity: 1,
      },
      {
        product: {
          id: 3,
          name: 'Collar Chakana',
          price: 195.0,
          image:
            'https://via.placeholder.com/150x150/f5f3f0/3d3d5c?text=Collar+Chakana',
          specs: 'Plata 925, 50 cm',
        },
        quantity: 1,
      },
    ];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity < 99) {
      item.quantity++;
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  updateQuantity(item: CartItem) {
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > 99) {
      item.quantity = 99;
    }
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      if (confirm(`¿Deseas eliminar "${item.product.name}" del carrito?`)) {
        this.cartItems.splice(index, 1);
      }
    }
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.cartItems = [];
    }
  }

  proceedToCheckout() {
    console.log('Procediendo al checkout...');
    alert('Redirigiendo al proceso de pago...');
    // Aquí redirigirías al checkout
    // this.router.navigate(['/checkout']);
  }

  constructor(private router: Router) {}
}
