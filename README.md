# SmartStore CL — Catálogo 0.2

Vista previa: https://xaulosky.github.io/smartstore-cl/

Catálogo editorial de 24 productos en 8 categorías para el usuario final: cámaras de interior, exterior Wi-Fi, cámaras a batería, timbres y mirillas, sensores, luces, redes y accesorios. Predomina EZVIZ; se complementa con Tapo, TP-Link y SanDisk.

## Estado comercial

No es una tienda habilitada para vender. Todos los precios y existencias son `null`, la disponibilidad local y los SKU regionales están pendientes de confirmar con un proveedor. No hay pagos, pedidos, reservas, formularios que envíen datos ni notificaciones comerciales reales. Mi lista funciona localmente y permite copiar una selección. Se retiraron las reseñas, existencias, ofertas y beneficios comerciales ficticios de la primera demo.

## Fuentes y variantes

Cada producto en `data.js` contiene `source` (ficha oficial), `image` (recurso del fabricante), `reviewedAt`, requisitos e instalación orientativa. Fuentes consultadas el 2026-10-07: EZVIZ Latinoamérica/España, TP-Link Chile y SanDisk. La clasificación de dificultad es editorial; no sustituye el manual.

La BC1c 4K Type-C usa ficha española y su disponibilidad en Chile no está validada. L530E se presenta como pack de 4 y Deco E4 como pack de 3: confirmar presentación regional antes de publicar precios. Deco E4 tiene puertos 10/100 Mbps. Las imágenes se enlazan a los fabricantes y pueden fallar: la interfaz muestra una alternativa de texto. Las imágenes de algunos modelos incluyen vistas técnicas. Antes del lanzamiento comercial, obtener fotos autorizadas del proveedor, optimizarlas y alojarlas con disponibilidad controlada. No se declara afiliación ni distribución autorizada.

T1C, T2C y T10C necesitan hub A3. Wi-Fi no significa alimentación inalámbrica. Paneles solares, tarjetas y cargadores requieren revisar compatibilidad y contenido del pack; no se prometen duraciones de batería ni grabación continua universal.

## Desarrollo

```sh
npm run dev
npm run check
node --test tests/catalog.test.mjs
```

El servidor de desarrollo usa el puerto 4173. El sitio no necesita instalar dependencias. GitHub Actions valida JavaScript y el catálogo y publica exclusivamente los archivos estáticos. Los tests de datos están incluidos en el repositorio.

La interfaz se comprobó en Chromium en tamaños 360×800, 390×844 y 1440×1000: filtros, búsqueda, favoritos, lista, cantidades, fichas, navegación al hub y recuperación de almacenamiento inválido. Esa comprobación de interfaz se ejecutó sin red externa y con almacenamiento simulado; no verifica disponibilidad de imágenes externas ni servicios comerciales.

## Próxima etapa

Confirmar proveedor, variantes, inventario, precios y políticas comerciales. Después implementar backend, autenticación, stock real, checkout, pagos, despacho y notificaciones transaccionales. Mantener `noindex` mientras sea una demo; retirarlo solo después de validar el catálogo comercial.
