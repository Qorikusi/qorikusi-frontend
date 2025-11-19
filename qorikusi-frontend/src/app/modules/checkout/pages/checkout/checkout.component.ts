import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  
  currentStep: number = 1;
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  selectedPaymentMethod: string = 'card';
  orderNumber: string = '';
  shippingCost: number = 15.00;

  // Items del pedido (simulación)
  orderItems: OrderItem[] = [
    {
      product: {
        id: 1,
        name: 'Collar Inti',
        price: 180.00,
        image: 'https://via.placeholder.com/80x80/f5f3f0/3d3d5c?text=Collar'
      },
      quantity: 2
    },
    {
      product: {
        id: 2,
        name: 'Anillo Lunar',
        price: 200.00,
        image: 'https://via.placeholder.com/80x80/f5f3f0/3d3d5c?text=Anillo'
      },
      quantity: 1
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForms();
    this.generateOrderNumber();
  }

  initForms() {
    // Formulario de Envío
    this.shippingForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: [''],
      notes: ['']
    });

    // Formulario de Pago
    this.paymentForm = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  generateOrderNumber() {
    this.orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    
    // Si no es tarjeta, limpiar validaciones del formulario de pago
    if (method !== 'card') {
      this.paymentForm.clearValidators();
      this.paymentForm.updateValueAndValidity();
    }
  }

  getSubtotal(): number {
    return this.orderItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  nextStep() {
    if (this.currentStep === 1 && this.shippingForm.valid) {
      this.currentStep = 2;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 2) {
      if (this.selectedPaymentMethod === 'card' && this.paymentForm.invalid) {
        // Marcar campos como tocados para mostrar errores
        Object.keys(this.paymentForm.controls).forEach(key => {
          this.paymentForm.get(key)?.markAsTouched();
        });
        return;
      }
      
      // Procesar el pago
      this.processPayment();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  processPayment() {
    console.log('Procesando pago...');
    console.log('Datos de envío:', this.shippingForm.value);
    console.log('Método de pago:', this.selectedPaymentMethod);
    
    if (this.selectedPaymentMethod === 'card') {
      console.log('Datos de tarjeta:', this.paymentForm.value);
    }
    
    // Simulación de pago exitoso
    setTimeout(() => {
      this.currentStep = 3;
      window.scrollTo(0, 0);
    }, 1000);
  }
}