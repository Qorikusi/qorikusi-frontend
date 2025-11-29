import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor para agregar el token JWT a las peticiones
 * 
 * Este interceptor agrega automáticamente el header Authorization con el token
 * SOLO a peticiones que van a endpoints protegidos (/admin/ o /customer/)
 * 
 * IMPORTANTE: NO agrega token a rutas públicas como /catalog/ o /auth/
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  // Lista de patrones de URL que REQUIEREN autenticación
  const requiresAuth = 
    req.url.includes('/admin/') || 
    req.url.includes('/customer/') ||
    req.url.includes('/client/') ||
    req.url.includes('/profile');
  
  // Lista de patrones de URL que NO deben llevar token (públicos)
  const isPublic = 
    req.url.includes('/catalog/') ||
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/auth/reset-password');
  
  // Si la ruta es pública, NO agregar token
  if (isPublic) {
    console.log('🌍 Ruta pública (sin token):', req.url);
    return next(req);
  }
  
  // Si hay token y la petición requiere auth, agregar el header
  if (token && requiresAuth) {
    console.log('🔒 Agregando token a la petición:', req.url);
    
    // Clonar la petición y agregar el header Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(clonedReq);
  }
  
  // Si no hay token pero la ruta requiere auth, continuar sin token
  // (el backend responderá 401 si es necesario)
  if (requiresAuth && !token) {
    console.log('⚠️ Ruta protegida sin token:', req.url);
  }
  
  // Continuar sin modificar la petición
  return next(req);
};