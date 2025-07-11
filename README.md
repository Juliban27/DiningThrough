# UniSabana Dining Through

## Descripción del Proyecto
UniSabana Dining Through es una aplicación web diseñada para reducir las filas en los restaurantes de la Universidad de la Sabana mediante un sistema de pedidos anticipados. La plataforma permite a los estudiantes y personal universitario realizar pedidos de comida por adelantado y recogerlos en el restaurante sin necesidad de esperar en fila, optimizando así el tiempo tanto para los clientes como para el personal de servicio.

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca de JavaScript para construir la interfaz de usuario
- **Vite**: Herramienta de compilación que proporciona un entorno de desarrollo más rápido
- **Tailwind CSS**: Framework de CSS para diseño rápido y responsivo
- **React Router**: Manejo de rutas en la aplicación

### Backend
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **Express.js**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL para almacenamiento de información
- **JWT (JSON Web Tokens)**: Para autenticación segura de usuarios
- **Bcrypt**: Librería para encriptación de contraseñas
- **RESTful API**: Arquitectura para comunicación cliente-servidor

## Instalación y Configuración

### Requisitos Previos
- Node.js (v14.0.0 o superior)
- npm o yarn
- MongoDB (local o Atlas)

### Pasos de Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/unisabana-dining-through.git
   cd unisabana-dining-through
2. Instalar dependencias:
    ```bash
   npm install

3.Configurar variables de entorno:
Crear un archivo .env en la raíz del proyecto con las siguientes variables:
PORT=5000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta

4.Iniciar la aplicación
   ```bash
   npm run dev``
   ```
## Características Principales

### Para Usuarios (Estudiantes/Personal)

Registro y Login Seguro: Sistema de autenticación con JWT y contraseñas encriptadas
Catálogo de Restaurantes: Visualización de todos los restaurantes disponibles en el campus
Menú Digital: Acceso a los menús completos de cada restaurante
Sistema de Pedidos: Interfaz intuitiva para seleccionar y personalizar pedidos
Notificaciones en Tiempo Real: Alertas sobre el estado del pedido
Historial de Pedidos: Registro de pedidos anteriores para referencia
Carrito de Compras: Gestión de múltiples productos en un pedido
Facturación: Generación automática de facturas para cada pedido

### Para Trabajadores de Restaurantes

Panel de Administración: Gestión eficiente de pedidos entrantes
Actualización de Estado: Cambio del estado de los pedidos (recibido, en preparación, listo)
Gestión de Menú: Capacidad para actualizar el menú y disponibilidad de productos
Inventario: Sistema de gestión de inventario para control de stock
Estadísticas: Datos sobre los pedidos y tiempos de preparación

###  Optimización de Tiempo

Reducción de tiempo de espera en filas
Mejor distribución del flujo de clientes
Mayor eficiencia en la preparación de alimentos
Análisis de datos para identificar horas pico y optimizar recursos

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Estructura del Proyecto
unisabana-dining-through/
├── public/                  # Archivos públicos
├── src/                     # Código fuente principal
│   ├── assets/              # Recursos estáticos (imágenes, iconos)
│   ├── components/          # Componentes reutilizables
│   ├── context/             # Contextos de React (Auth, Cart)
│   ├── fonts/               # Fuentes personalizadas
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas principales de la aplicación
│   ├── services/            # Servicios de API y funcionalidades
│   ├── index.css            # Estilos globales
│   └── main.jsx             # Punto de entrada de React
├── .gitignore               # Archivos ignorados por git
├── README.md                # Documentación del proyecto
├── eslint.config.js         # Configuración de ESLint
├── index.html               # Archivo HTML principal
├── package-lock.json        # Bloqueo de versiones de dependencias
├── package.json             # Configuración y dependencias del proyecto
├── tailwind.config.js       # Configuración de Tailwind CSS
└── vite.config.js           # Configuración de Vite

