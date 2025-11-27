import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Producto, PageResponse } from '../modelos/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.apiProductsUrl}/catalog/products`;
  
  // Cache local de productos para búsqueda y filtrado del lado del cliente
  private productosCache$ = new BehaviorSubject<Producto[]>([]);
  
  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los productos del catálogo (activos)
   * Carga todos los productos de una vez para permitir búsqueda/filtrado del lado del cliente
   */
  obtenerProductos(categoria?: string): Observable<Producto[]> {
    let params = new HttpParams()
      .set('size', '1000') // Cargar muchos productos a la vez
      .set('page', '0');

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params })
      .pipe(
        map(response => response.content),
        tap(productos => {
          // Actualizar cache
          this.productosCache$.next(productos);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener productos con paginación real del backend
   */
  obtenerProductosPaginados(page: number = 0, size: number = 12, categoria?: string): Observable<PageResponse<Producto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener un producto por su UUID
   */
  obtenerProductoPorId(uuid: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${uuid}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * 🔍 BÚSQUEDA DEL LADO DEL CLIENTE
   * Buscar productos por nombre (case-insensitive)
   */
  buscarProductos(termino: string, productos: Producto[]): Producto[] {
    if (!termino || termino.trim() === '') {
      return productos;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoLower) ||
      producto.descripcion.toLowerCase().includes(terminoLower) ||
      producto.categoria.toLowerCase().includes(terminoLower)
    );
  }

  /**
   * 🎯 FILTRADO DEL LADO DEL CLIENTE
   * Filtrar productos por categoría
   */
  filtrarPorCategoria(productos: Producto[], categoria: string): Producto[] {
    if (!categoria || categoria === '') {
      return productos;
    }
    
    return productos.filter(p => 
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  /**
   * 💰 FILTRADO DEL LADO DEL CLIENTE
   * Filtrar productos por rango de precio
   */
  filtrarPorPrecio(productos: Producto[], precioMin?: number, precioMax?: number): Producto[] {
    let resultado = [...productos];

    if (precioMin !== undefined && precioMin !== null) {
      resultado = resultado.filter(p => p.precio >= precioMin);
    }

    if (precioMax !== undefined && precioMax !== null) {
      resultado = resultado.filter(p => p.precio <= precioMax);
    }

    return resultado;
  }

  /**
   * 🌙 FILTRADO DEL LADO DEL CLIENTE
   * Filtrar productos por energía lunar
   */
  filtrarPorEnergiaLunar(productos: Producto[], energia: string): Producto[] {
    if (!energia || energia === '') {
      return productos;
    }
    
    return productos.filter(p => 
      p.energiaLunar?.toLowerCase() === energia.toLowerCase()
    );
  }

  /**
   * 📊 ORDENAMIENTO DEL LADO DEL CLIENTE
   * Ordenar productos según diferentes criterios
   */
  ordenarProductos(productos: Producto[], criterio: string): Producto[] {
    const productosCopia = [...productos];

    switch (criterio) {
      case 'price-asc':
        return productosCopia.sort((a, b) => a.precio - b.precio);
      
      case 'price-desc':
        return productosCopia.sort((a, b) => b.precio - a.precio);
      
      case 'name-asc':
        return productosCopia.sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
        );
      
      case 'name-desc':
        return productosCopia.sort((a, b) => 
          b.nombre.localeCompare(a.nombre)
        );
      
      default:
        return productosCopia;
    }
  }

  /**
   * 🔄 MÉTODO COMBINADO
   * Aplicar todos los filtros y ordenamiento a la vez
   */
  aplicarFiltrosYOrdenamiento(
    productos: Producto[],
    filtros: {
      busqueda?: string;
      categoria?: string;
      precioMin?: number;
      precioMax?: number;
      energiaLunar?: string;
      ordenamiento?: string;
    }
  ): Producto[] {
    let resultado = [...productos];

    // Aplicar búsqueda
    if (filtros.busqueda) {
      resultado = this.buscarProductos(filtros.busqueda, resultado);
    }

    // Aplicar filtro de categoría
    if (filtros.categoria) {
      resultado = this.filtrarPorCategoria(resultado, filtros.categoria);
    }

    // Aplicar filtro de precio
    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      resultado = this.filtrarPorPrecio(resultado, filtros.precioMin, filtros.precioMax);
    }

    // Aplicar filtro de energía lunar
    if (filtros.energiaLunar) {
      resultado = this.filtrarPorEnergiaLunar(resultado, filtros.energiaLunar);
    }

    // Aplicar ordenamiento
    if (filtros.ordenamiento) {
      resultado = this.ordenarProductos(resultado, filtros.ordenamiento);
    }

    return resultado;
  }

  /**
   * 📦 Obtener productos del cache
   */
  obtenerProductosCache(): Observable<Producto[]> {
    return this.productosCache$.asObservable();
  }

  /**
   * ⚠️ Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al obtener los productos';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      const serverError = error.error;
      
      switch (serverError?.code) {
        case 'PRODUCT_NOT_FOUND':
          errorMessage = 'Producto no encontrado';
          break;
        
        case 'CATEGORY_NOT_FOUND':
          errorMessage = 'Categoría no encontrada';
          break;
        
        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;
        
        case 'INTERNAL_ERROR':
          errorMessage = 'Error interno del servidor. Por favor intenta más tarde';
          break;
        
        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('Error en ProductoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}