export const categories = [
  { id: 'camaras', name: 'Cámaras', icon: '◉', description: 'IP, Wi-Fi, PoE y kits completos' },
  { id: 'domotica', name: 'Domótica', icon: '⌂', description: 'Automatización y hogar inteligente' },
  { id: 'alarmas', name: 'Alarmas', icon: '⌁', description: 'Sensores, sirenas y centrales' },
  { id: 'acceso', name: 'Control de acceso', icon: '▣', description: 'Cerraduras, videoporteros y biometría' },
  { id: 'redes', name: 'Redes', icon: '⌘', description: 'Routers, switches, PoE y conectividad' },
  { id: 'energia', name: 'Energía', icon: 'ϟ', description: 'UPS, fuentes y respaldo eléctrico' }
];

export const products = [
  {
    id: 'cam-4mp-poe', sku: 'CAM-4MP-POE', name: 'Cámara IP PoE 4MP Visión Nocturna',
    category: 'camaras', brand: 'Hikvision', price: 69990, compareAt: 79990, rating: 4.9, reviews: 128,
    stock: 18, badge: 'Más vendido', image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=900&q=82',
    features: ['Resolución 4 MP', 'PoE', 'Visión nocturna', 'Detección de movimiento']
  },
  {
    id: 'kit-4cam-nvr', sku: 'KIT-NVR-4CH', name: 'Kit Seguridad 4 Cámaras + NVR + Disco 1TB',
    category: 'camaras', brand: 'Dahua', price: 289990, compareAt: 329990, rating: 4.8, reviews: 76,
    stock: 7, badge: 'Oferta', image: 'https://images.unsplash.com/photo-1614064548237-096f735f344f?auto=format&fit=crop&w=900&q=82',
    features: ['4 cámaras Full HD', 'NVR 4 canales', 'Disco 1 TB', 'Acceso remoto']
  },
  {
    id: 'cerradura-smart', sku: 'LOCK-WIFI-01', name: 'Cerradura Inteligente Wi-Fi Huella + Clave',
    category: 'acceso', brand: 'Tuya', price: 119990, compareAt: 139990, rating: 4.7, reviews: 54,
    stock: 9, badge: 'Nuevo', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=82',
    features: ['Huella digital', 'Clave temporal', 'App móvil', 'Llave de respaldo']
  },
  {
    id: 'sensor-puerta', sku: 'SENSOR-ZB-01', name: 'Sensor Puerta/Ventana Zigbee',
    category: 'domotica', brand: 'Sonoff', price: 15990, compareAt: null, rating: 4.6, reviews: 91,
    stock: 42, badge: null, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=82',
    features: ['Zigbee 3.0', 'Bajo consumo', 'Notificación instantánea', 'Escenas inteligentes']
  },
  {
    id: 'switch-poe-8', sku: 'SW-POE-8', name: 'Switch PoE Gigabit 8 Puertos',
    category: 'redes', brand: 'TP-Link', price: 89990, compareAt: 99990, rating: 4.9, reviews: 38,
    stock: 13, badge: null, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=82',
    features: ['8 puertos Gigabit', 'PoE+', 'Plug & Play', 'Protección contra sobrecarga']
  },
  {
    id: 'sirena-wifi', sku: 'SIREN-WIFI', name: 'Sirena Interior Wi-Fi 110 dB',
    category: 'alarmas', brand: 'SmartLife', price: 29990, compareAt: 34990, rating: 4.5, reviews: 31,
    stock: 24, badge: null, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=82',
    features: ['110 dB', 'Wi-Fi 2.4 GHz', 'Automatizaciones', 'Alerta en app']
  },
  {
    id: 'videoportero', sku: 'DOORBELL-2K', name: 'Videoportero Wi-Fi 2K con Audio Bidireccional',
    category: 'acceso', brand: 'EZVIZ', price: 94990, compareAt: 109990, rating: 4.8, reviews: 64,
    stock: 11, badge: 'Recomendado', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=82',
    features: ['Video 2K', 'Audio bidireccional', 'Detección humana', 'Visión nocturna']
  },
  {
    id: 'ups-1200', sku: 'UPS-1200VA', name: 'UPS 1200VA Respaldo para Cámaras y Red',
    category: 'energia', brand: 'Forza', price: 79990, compareAt: null, rating: 4.7, reviews: 42,
    stock: 8, badge: null, image: 'https://images.unsplash.com/photo-1609592424824-6f12b887c8c5?auto=format&fit=crop&w=900&q=82',
    features: ['1200 VA', 'Protección AVR', '4 tomas', 'Indicadores LED']
  }
];
