# SmartStore CL — Ecommerce de seguridad, domótica y electrónica

Primera base funcional sin dependencias externas, creada para validar UX y flujos mientras se prepara la versión productiva.

## Ejecutar

```bash
npm run dev
```

Abrir `http://localhost:4173`.

## Incluido en V0.1
- Home responsive y orientada a conversión.
- Catálogo de cámaras, domótica, alarmas, acceso, redes y energía.
- Búsqueda, filtros y categorías.
- Carrito persistente con `localStorage`.
- Favoritos persistentes.
- Vista rápida de producto.
- Notificaciones tipo toast.
- Umbral de despacho gratis.
- CTA de asesoría, venta empresas y newsletter.
- Formato de precios CLP.
- Servidor Node sin dependencias.

## Próxima arquitectura productiva
- Next.js + TypeScript.
- PostgreSQL + Prisma.
- Autenticación de clientes y administradores.
- Catálogo/variantes/stock/bodegas.
- Checkout y órdenes.
- Webpay Plus / Mercado Pago según definición comercial.
- Integración de despacho (Blue Express / Starken / Chilexpress según evaluación).
- Emails transaccionales + WhatsApp.
- Panel administrador.
- Cupones, promociones, reseñas y recuperación de carrito.
- SEO técnico, Schema.org, feeds de productos y analítica.

El nombre `SmartStore` es temporal y se puede cambiar globalmente cuando se defina la marca.
