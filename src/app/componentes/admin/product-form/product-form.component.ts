import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../servicio/producto.service';
import { CategoriaService } from '../../../servicio/categoria.service';
import { ProductoRequest } from '../../../modelos/Producto';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  categorias: string[] = [];
  energiasLunares: string[] = [
    'Luna Nueva',
    'Luna Creciente',
    'Luna Llena',
    'Luna Menguante',
    'Protección',
    'Amor',
    'Abundancia',
    'Sanación'
  ];
  
  isEditMode = false;
  productoId: string | null = null;
  
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      energiaLunar: [''],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar categorías
    this.cargarCategorias();
    
    // Verificar si es modo edición
    this.route.paramMap.subscribe(params => {
      this.productoId = params.get('id');
      if (this.productoId) {
        this.isEditMode = true;
        this.cargarProducto(this.productoId);
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias.map(c => c.nombre);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        // Si falla, usar categorías por defecto
        this.categorias = ['Collares', 'Pulseras', 'Anillos', 'Aretes', 'Sets'];
      }
    });
  }

  cargarProducto(uuid: string) {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductoPorId(uuid).subscribe({
      next: (producto) => {
        this.productForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          categoria: producto.categoria,
          energiaLunar: producto.energiaLunar || '',
          imagen: producto.imagen
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar producto:', error);
        this.error = 'No se pudo cargar el producto';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.submitting = true;
    this.error = '';

    const formValue = this.productForm.value;
    const productoData: ProductoRequest = {
      nombre: formValue.nombre.trim(),
      descripcion: formValue.descripcion.trim(),
      precio: parseFloat(formValue.precio),
      stock: parseInt(formValue.stock, 10),
      categoria: formValue.categoria,
      energiaLunar: formValue.energiaLunar || undefined,
      imagen: formValue.imagen.trim()
    };

    if (this.isEditMode && this.productoId) {
      // Actualizar producto existente
      this.productoService.actualizarProducto(this.productoId, productoData).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.error = 'No se pudo actualizar el producto';
          this.submitting = false;
        }
      });
    } else {
      // Crear nuevo producto
      this.productoService.crearProducto(productoData).subscribe({
        next: () => {
          alert('Producto creado correctamente');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          this.error = 'No se pudo crear el producto';
          this.submitting = false;
        }
      });
    }
  }

  onCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/admin/products']);
    }
  }

  // Helpers de validación
  isFieldInvalid(field: string): boolean {
    const formField = this.productForm.get(field);
    return !!(formField && formField.invalid && (formField.dirty || formField.touched));
  }

  getFieldError(field: string): string {
    const formField = this.productForm.get(field);
    if (!formField || !formField.errors) return '';

    const errors = formField.errors;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}`;
    
    return 'Campo inválido';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Producto' : 'Nuevo Producto';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Actualizar Producto' : 'Crear Producto';
  }
}
