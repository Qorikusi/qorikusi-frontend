import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from '../modelos/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioActual: Usuario | null = null;

  constructor() {
    this.cargarUsuario();
  }

  login(email: string, password: string): Observable<Usuario> {
    const usuario: Usuario = {
      id: 1,
      nombre: 'Usuario',
      apellido: 'Demo',
      email: email,
      telefono: '999999999'
    };
    
    this.usuarioActual = usuario;
    this.guardarUsuario(usuario);
    
    return of(usuario).pipe(delay(1000));
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
  }

  estaAutenticado(): boolean {
    return this.usuarioActual !== null;
  }

  private guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  private cargarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioActual = JSON.parse(usuarioGuardado);
    }
  }
}
