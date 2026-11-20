# Cabernicolas Barbershop 💈

Plataforma web de identidad editorial y lujo contemporáneo para **"Cabernicolas Barbershop"**, concebida bajo las directrices de la skill **Frontend Design** de Anthropic: estética de atelier de autor, tipografía con carácter, composiciones asimétricas auténticas, paleta en negro carbón aterciopelado (`#0A0B0E`), marfil cálido (`#F5F2EB`) y bronce cepillado (`#C5A059`), sin clichés genéricos de IA.

---

## 🏛️ Sistema Visual & Filosofía de Diseño

- **Atmósfera:** Atelier masculino de precisión en Cancún. Cuero oscuro, navaja libre, toallas calientes y pausa ritual.
- **Paleta de Tokens:**
  - `Base Profunda:` `#0A0B0E` (Negro carbón mate con grano arquitectónico)
  - `Superficies:` `#12141A` y `#181B22` (Planos oscuros contrastantes)
  - `Texto Principal:` `#F5F2EB` (Marfil cálido orgánico, alta legibilidad)
  - `Texto Secundario:` `#9EA3AE` (Gris neutro editorial)
  - `Acento Bronce:` `#C5A059` (Bronce cálido cepillado con reserva intencional)
  - `Estado Esmeralda:` `#10B981` (Para WhatsApp y estado "Abierto Ahora")
- **Tipografía:**
  - *Titulares de Marca:* **Cinzel** (Serif clásico con tracking y espaciado editorial).
  - *Cuerpo & UI:* **Plus Jakarta Sans** (Humanista contemporáneo, limpio y funcional).
  - *Metadatos & Folios:* **Space Grotesk** (Monospace proporcional para cifras y tickets).

---

## 🌟 Estructura de Secciones

### 1. Portada (Hero Editorial)
- Composición asimétrica: Manifiesto de marca a la izquierda con llamadas a la acción directas y fotografía auténtica de barbería artesanal a la derecha.
- Barra horizontal de valores de artesanía (*Vapor & Navaja Libre*, *Cortesía de Bienvenida*, *Barberos Especialistas*, *Confirmación Inmediata*) en sustitución de las tarjetas SaaS genéricas.
- Indicador en vivo de apertura según el horario oficial de Cancún (UTC-5).

### 2. Experiencias Cabernicolas (Categoría A)
- Exposición arquitectónica de 3 columnas destacando **Black Label ($430 MXN)** como experiencia insignia (*Flagship*), junto a **Executive ($380 MXN)** y **Essential ($280 MXN)**.
- Botones de selección directa que preseleccionan el paquete y desplazan al usuario suavemente al módulo de reserva.

### 3. Servicios de Especialidad (Categoría B)
- Menú editorial estructurado con líneas divisorias sobrias, precios claros y botones interactivos `+ Añadir` que se sincronizan en tiempo real con la bandeja de reserva.

### 4. Sistema de Citas Online (3 Pasos Intuitivos)
- **Paso 1 (Servicios):** Experiencia elegida y chips interactivos de especialidades adicionales con subtotal dinámico.
- **Paso 2 (Fecha y Horario):** Selector de fecha con restricción de fechas pasadas y bloques horarios inteligentes:
  - *Lunes a Sábado:* 10:00 a.m. a 8:00 p.m.
  - *Domingo:* 10:00 a.m. a 6:00 p.m.
  - Bloqueo automático de horas ya transcurridas en el día en curso.
- **Paso 3 (Datos del Caballero):** Nombre, teléfono a 10 dígitos y notas opcionales.
- **Bandeja de Resumen Fija:** Cálculo en tiempo real, desglose de servicios y botón principal *"Confirmar Cita"*.

### 5. Flujo de Confirmación & WhatsApp
- **Comprobante Digital VIP:** Folio único (ej. `#CAV-78421`), desglose de servicios, fecha, hora, total a liquidar y código de barras estilizado.
- **Botón directo a WhatsApp:** Abre `https://wa.me/529983374945` con el mensaje formateado con todos los detalles de la cita.
- **Módulo "Mis Citas":** Almacenamiento local persistente (`localStorage`) que permite revisar o cancelar citas guardadas.

### 6. Horarios, Contacto y Ubicación
- Estado en tiempo real (*Abierto Ahora* / *Cerrado por ahora*).
- Dirección oficial en Cancún: Calle Prol. Av. Kabáh 1, Paseos Kabah, 77517 Cancún, Q.R.
- Mapa interactivo integrado de Google Maps con enlace directo *"Cómo llegar"*.
- Botón flotante discreto de WhatsApp en la esquina inferior derecha.

---

## 📂 Estructura del Proyecto

```text
CabernicolasBarbershop/
├── .agents/
│   └── skills/
│       └── frontend-design/
│           └── SKILL.md        # Skill oficial de Anthropic instalada
├── index.html                  # HTML semántico, estructurado y accesible
├── css/
│   └── styles.css              # Sistema visual editorial luxury autocontenido
├── js/
│   └── app.js                  # Lógica reactiva, slots dinámicos, cálculo y WhatsApp
├── assets/
│   └── favicon.svg             # Monograma vectorial en bronce y carbon
└── README.md                   # Documentación técnica y de diseño
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. **Apertura directa:**
   Doble clic sobre [index.html](index.html) en cualquier navegador moderno.
2. **Servidor local (opcional):**
   ```bash
   npx serve .
   # o
   python -m http.server 8000
   ```
