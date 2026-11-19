# Cavernícolas BarberShop 💈

Aplicación web moderna, elegante y 100% responsiva (mobile-first) para **"Cavernícolas BarberShop"**, desarrollada con estética de lujo masculino clásico: fondo negro mate texturizado, acentos en dorado metálico (`#D4AF37`) y tipografía limpia de alta legibilidad.

---

## 🌟 Características Principales

### 1. Identidad y Sección Hero
- **Marca:** Cavernícolas BarberShop
- **Slogan:** *"Experiencias diseñadas para hombres fieles"*
- **Navegación Fija:** Enlaces directos a *Experiencias*, *Servicios*, *Reservar Cita* y *Horarios y Ubicación*.
- **Indicador Dinámico en Vivo:** Detecta en tiempo real si la barbería está **Abierta** o **Cerrada** según la hora y día de Cancún, Q.R.
- **Llamada a la Acción (CTA):** Botón principal *"Agendar mi experiencia"* con desplazamiento suave al sistema de reservas.

### 2. Catálogo de Servicios
- **Categoría A: ★ Experiencias Cavernícolas (Paquetes recomendados):**
  - **Cavernícolas Black Label — $430 MXN** *(Insignia dorada: "EL MÁS ELEGIDO")*: Corte premium + Barba premium + Perfilado de ceja de precisión + Limpieza facial profunda.
  - **Cavernícolas Executive — $380 MXN**: Corte premium + Barba premium + Limpieza facial revitalizante.
  - **Cavernícolas Essential — $280 MXN**: Corte premium + Perfilado de ceja de precisión.
- **Categoría B: ✂ Servicios de Especialidad (Menú con líneas punteadas):**
  - Corte Clásico de Cabello — $200 MXN
  - Afeitado Tradicional de Barba — $150 MXN
  - Perfilado de bigote de precisión — $100 MXN
  - Depilación nasal premium — $100 MXN
  - Limpieza profunda de carbón activado — $90 MXN
  - Perfilado de ceja de precisión — $70 MXN
  - Facial revitalizante express — $50 MXN
  - Diseño freestyle personalizado — $50 MXN

### 3. Módulo Interactivo de Citas + Confirmación por WhatsApp
- **Selección Múltiple y Cálculo en Tiempo Real:** Puedes elegir una experiencia principal y/o sumar uno o varios servicios de especialidad, calculando el total al instante.
- **Horarios Dinámicos Inteligentes:**
  - **Lunes a Sábado:** Bloques cada 30 minutos entre **10:00 a.m. y 8:00 p.m.**
  - **Domingo:** Bloques cada 30 minutos entre **10:00 a.m. y 6:00 p.m.**
  - Validación de fechas pasadas y bloqueo automático de horarios transcurridos en el día en curso.
- **Flujo de Confirmación:**
  1. Genera un **Comprobante / Ticket Digital Oficial** con Folio único (ej. `#CAV-84920`), resumen desglosado, total a liquidar y código de barras estilizado.
  2. Guarda la reserva localmente en el navegador (`localStorage`) con modal para **"Mis Citas"** y opción de cancelación.
  3. Botón de **"Enviar confirmación por WhatsApp"** que redirige a `https://wa.me/529983374945` con mensaje perfectamente formateado y detallado con la información completa de la cita.

### 4. Horarios, Contacto y Ubicación
- **Horarios:** Lunes a Sábado de 10:00 a.m. a 8:00 p.m. | Domingo de 10:00 a.m. a 6:00 p.m.
- **Teléfono / WhatsApp:** 998 337 4945
- **Dirección:** Calle Prol. Av. Kabáh 1, Paseos Kabah, 77517 Cancún, Q.R.
- **Mapa Interactivo:** Mapa embebido estilizado con coordenadas exactas y botón directo *"Cómo llegar en Google Maps"*.
- **Botón Flotante:** Acceso rápido a WhatsApp en la esquina inferior derecha con tooltip y efecto de pulso.

---

## 📂 Estructura del Proyecto

```text
CabernicolasBarbershop/
├── index.html          # Estructura semántica HTML5 y componentes accesibles
├── css/
│   └── styles.css      # Estilos CSS3 luxury: paleta negro/oro, gradientes y animaciones
├── js/
│   └── app.js          # Lógica interactiva, selector de slots, ticket y WhatsApp API
├── assets/
│   └── favicon.svg     # Icono vectorial dorado para la pestaña del navegador
└── README.md           # Documentación completa del proyecto
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. **Abrir directamente:**
   Haz doble clic sobre el archivo `index.html` en tu navegador favorito (Chrome, Edge, Firefox, Safari).
2. **Servidor local (opcional):**
   Si prefieres ejecutar un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000

   # O con Node.js / npx
   npx serve .
   ```
   Luego ingresa a `http://localhost:8000`.
