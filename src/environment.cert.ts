export const environment = {
  production: false,
  // URLs de los microservicios del backend
  apiUrl: 'https://qorikusi-auth-identity-qa.azurewebsites.net',              // Servicio de autenticación
  apiProductsUrl: 'https://qorikusi-products.azurewebsites.net',           // Servicio de productos
  apiCartUrl: 'https://qorikusi-cart.azurewebsites.net',               // Servicio de carrito
  apiCustomerUrl: 'https://qorikusi-customers.azurewebsites.net',           // Servicio de cliente (si existe)
  
  // Configuración adicional
  defaultPageSize: 12,
  maxItemsPerProduct: 10,
  freeShippingThreshold: 250
};