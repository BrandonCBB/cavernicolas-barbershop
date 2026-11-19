/**
 * Cavernícolas BarberShop - Core Application Logic
 * Modern, responsive booking system with WhatsApp confirmation flow
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Data Store & State ---
  const state = {
    selectedPackage: null, // { id, name, price }
    selectedSpecialties: new Map(), // id -> { id, name, price }
    selectedDate: '',
    selectedTime: '',
    clientName: '',
    clientPhone: '',
    clientNotes: '',
    appointments: JSON.parse(localStorage.getItem('cavernicolas_appointments') || '[]')
  };

  // Specialties master data
  const SPECIALTY_SERVICES = [
    { id: 'srv-corte-clasico', name: 'Corte Clásico de Cabello', price: 200 },
    { id: 'srv-afeitado-barba', name: 'Afeitado Tradicional de Barba', price: 150 },
    { id: 'srv-perfilado-bigote', name: 'Perfilado de bigote de precisión', price: 100 },
    { id: 'srv-depilacion-nasal', name: 'Depilación nasal premium', price: 100 },
    { id: 'srv-carbon-activado', name: 'Limpieza profunda de carbón activado', price: 90 },
    { id: 'srv-perfilado-ceja', name: 'Perfilado de ceja de precisión', price: 70 },
    { id: 'srv-facial-express', name: 'Facial revitalizante express', price: 50 },
    { id: 'srv-freestyle', name: 'Diseño freestyle personalizado', price: 50 }
  ];

  // DOM Elements
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const currentYearSpan = document.getElementById('current-year');
  const shopLiveStatus = document.getElementById('shop-live-status');
  const shopPulseIndicator = document.getElementById('shop-pulse-indicator');
  const badgeOpenStatus = document.getElementById('badge-open-status');

  // Booking Form & Summary Elements
  const bookingForm = document.getElementById('booking-form');
  const clientNameInput = document.getElementById('client-name');
  const clientPhoneInput = document.getElementById('client-phone');
  const appointmentDateInput = document.getElementById('appointment-date');
  const selectedTimeInput = document.getElementById('selected-time-slot');
  const clientNotesInput = document.getElementById('client-notes');
  const slotsContainer = document.getElementById('slots-container');
  const dayScheduleHint = document.getElementById('day-schedule-hint');
  const slotsRangeBadge = document.getElementById('slots-range-badge');

  // Summary Container
  const summaryItemsList = document.getElementById('summary-items-list');
  const summaryCountServices = document.getElementById('summary-count-services');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const previewDate = document.getElementById('preview-date');
  const previewTime = document.getElementById('preview-time');
  const selectedPkgDisplay = document.getElementById('selected-package-display');
  const btnClearPackage = document.getElementById('btn-clear-package');
  const bookingSpecialtiesChips = document.getElementById('booking-specialties-chips');

  // Modals
  const modalTicket = document.getElementById('modal-ticket');
  const btnCloseTicket = document.getElementById('btn-close-ticket');
  const btnCloseTicketX = document.getElementById('btn-close-ticket-x');
  const btnPrintTicket = document.getElementById('btn-print-ticket');
  const btnTicketWhatsapp = document.getElementById('btn-ticket-whatsapp');

  const modalMyAppointments = document.getElementById('modal-my-appointments');
  const btnOpenMyAppointments = document.getElementById('btn-open-my-appointments');
  const btnOpenMyAppointmentsMobile = document.getElementById('btn-open-my-appointments-mobile');
  const btnCloseMyAppointments = document.getElementById('btn-close-my-appointments');
  const btnCloseMyAppointmentsX = document.getElementById('btn-close-my-appointments-x');
  const myAppointmentsList = document.getElementById('my-appointments-list');
  const badgeMyAppointments = document.getElementById('badge-my-appointments');

  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // --- Initialize App ---
  initApp();

  function initApp() {
    setupCurrentYear();
    setupLiveScheduleStatus();
    setupHeaderScroll();
    setupMobileMenu();
    setupDateConstraints();
    renderSpecialtiesChips();
    bindCatalogEvents();
    bindFormEvents();
    bindModalEvents();
    updateMyAppointmentsBadge();
  }

  // --- Year & Schedule Check ---
  function setupCurrentYear() {
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  function setupLiveScheduleStatus() {
    checkBusinessHours();
    setInterval(checkBusinessHours, 60000); // Check every minute
  }

  function checkBusinessHours() {
    // Cancun / Quintana Roo is UTC-5 (America/Cancun)
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1-6 is Mon-Sat
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTimeVal = hour * 60 + minute;

    let isOpen = false;
    let scheduleText = '';

    if (day === 0) {
      // Sunday: 10:00 a.m. – 6:00 p.m.
      isOpen = (currentTimeVal >= 10 * 60 && currentTimeVal < 18 * 60);
      scheduleText = 'Domingo: 10:00 AM – 6:00 PM';
    } else {
      // Mon - Sat: 10:00 a.m. – 8:00 p.m.
      isOpen = (currentTimeVal >= 10 * 60 && currentTimeVal < 20 * 60);
      scheduleText = 'Lunes a Sábado: 10:00 AM – 8:00 PM';
    }

    if (shopPulseIndicator) {
      shopPulseIndicator.className = isOpen ? 'pulse-dot' : 'pulse-dot closed';
    }

    if (shopLiveStatus) {
      if (isOpen) {
        shopLiveStatus.innerHTML = `<span class="text-emerald-400 font-bold">Abierto Ahora</span> • Paseos Kabah (${scheduleText})`;
      } else {
        shopLiveStatus.innerHTML = `<span class="text-amber-400 font-bold">Cerrado por ahora</span> • Reanudamos a las 10:00 AM (${scheduleText})`;
      }
    }

    if (badgeOpenStatus) {
      if (isOpen) {
        badgeOpenStatus.textContent = 'Abierto Ahora';
        badgeOpenStatus.className = 'status-badge-live open';
      } else {
        badgeOpenStatus.textContent = 'Cerrado Ahora';
        badgeOpenStatus.className = 'status-badge-live closed';
      }
    }
  }

  // --- Header & Navigation ---
  function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function setupMobileMenu() {
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });

      // Close drawer on link click
      const mobileLinks = mobileDrawer.querySelectorAll('a, button');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
        });
      });
    }
  }

  // --- Date Picker Constraints ---
  function setupDateConstraints() {
    if (appointmentDateInput) {
      // Format today as YYYY-MM-DD
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const minDate = `${yyyy}-${mm}-${dd}`;
      appointmentDateInput.min = minDate;

      // Set max date to 60 days ahead
      const maxDateObj = new Date();
      maxDateObj.setDate(maxDateObj.getDate() + 60);
      const maxYYYY = maxDateObj.getFullYear();
      const maxMM = String(maxDateObj.getMonth() + 1).padStart(2, '0');
      const maxDD = String(maxDateObj.getDate()).padStart(2, '0');
      appointmentDateInput.max = `${maxYYYY}-${maxMM}-${maxDD}`;
    }
  }

  // --- Render Specialty Chips in Step 1 ---
  function renderSpecialtiesChips() {
    if (!bookingSpecialtiesChips) return;
    bookingSpecialtiesChips.innerHTML = '';

    SPECIALTY_SERVICES.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'chip-item specialty-chip';
      chip.dataset.id = item.id;
      chip.innerHTML = `
        <div class="flex items-center gap-2 truncate pr-1">
          <input type="checkbox" id="chk-${item.id}" class="accent-gold-500 rounded cursor-pointer" style="accent-color: #D4AF37;">
          <label for="chk-${item.id}" class="truncate cursor-pointer text-gray-300 font-medium text-xs">${item.name}</label>
        </div>
        <span class="text-gold-400 font-bold font-mono text-xs whitespace-nowrap">$${item.price}</span>
      `;

      const checkbox = chip.querySelector('input');
      chip.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        toggleSpecialty(item.id, item.name, item.price, checkbox.checked);
      });

      bookingSpecialtiesChips.appendChild(chip);
    });
  }

  // --- Catalog Interaction Handlers ---
  function bindCatalogEvents() {
    // Categoría A: Packages
    const packageButtons = document.querySelectorAll('.btn-select-package');
    packageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.packageId;
        const name = btn.dataset.packageName;
        const price = parseInt(btn.dataset.packagePrice, 10);
        selectPackage(id, name, price);

        // Smooth scroll to booking
        document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        showToast(`¡Has elegido la experiencia "${name}"!`);
      });
    });

    // Step 1: Package Pickers inside booking card
    const pkgPickerButtons = document.querySelectorAll('.btn-picker-pkg');
    pkgPickerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.pkgId;
        const name = btn.dataset.pkgName;
        const price = parseInt(btn.dataset.pkgPrice, 10);

        if (state.selectedPackage && state.selectedPackage.id === id) {
          clearPackage();
        } else {
          selectPackage(id, name, price);
        }
      });
    });

    // Clear package button
    if (btnClearPackage) {
      btnClearPackage.addEventListener('click', () => {
        clearPackage();
      });
    }

    // Categoría B: Specialty list "+ Añadir" buttons
    const specialtyAddButtons = document.querySelectorAll('.btn-add-specialty');
    specialtyAddButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price, 10);

        const isCurrentlySelected = state.selectedSpecialties.has(id);
        toggleSpecialty(id, name, price, !isCurrentlySelected);

        if (!isCurrentlySelected) {
          showToast(`"${name}" añadido a tu cita.`);
        }
      });
    });
  }

  function selectPackage(id, name, price) {
    state.selectedPackage = { id, name, price };

    // Update Step 1 visual buttons
    document.querySelectorAll('.btn-picker-pkg').forEach(btn => {
      if (btn.dataset.pkgId === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Catalog category A cards
    document.querySelectorAll('.experience-card').forEach(card => {
      const cardBtn = card.querySelector('.btn-select-package');
      if (cardBtn && cardBtn.dataset.packageId === id) {
        card.style.borderColor = '#D4AF37';
        cardBtn.innerHTML = '<span>✓ Experiencia Seleccionada</span>';
      } else if (cardBtn) {
        card.style.borderColor = '';
        const defaultName = cardBtn.dataset.packageName.replace('Cavernícolas ', '');
        cardBtn.innerHTML = `<span>Elegir Experiencia ${defaultName}</span>`;
      }
    });

    if (selectedPkgDisplay) {
      selectedPkgDisplay.innerHTML = `<span class="text-white font-semibold">★ ${name}</span> — <span class="text-gold-400 font-bold">$${price} MXN</span>`;
    }
    if (btnClearPackage) {
      btnClearPackage.classList.remove('hidden');
    }

    updateSummary();
  }

  function clearPackage() {
    state.selectedPackage = null;
    document.querySelectorAll('.btn-picker-pkg').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.experience-card').forEach(card => {
      card.style.borderColor = '';
      const cardBtn = card.querySelector('.btn-select-package');
      if (cardBtn) {
        const defaultName = cardBtn.dataset.packageName.replace('Cavernícolas ', '');
        cardBtn.innerHTML = `<span>Elegir Experiencia ${defaultName}</span>`;
      }
    });

    if (selectedPkgDisplay) {
      selectedPkgDisplay.textContent = 'Ninguna experiencia elegida (selecciónala arriba o haz clic abajo):';
    }
    if (btnClearPackage) {
      btnClearPackage.classList.add('hidden');
    }

    updateSummary();
  }

  function toggleSpecialty(id, name, price, forceSelect) {
    if (forceSelect) {
      state.selectedSpecialties.set(id, { id, name, price });
    } else {
      state.selectedSpecialties.delete(id);
    }

    // Sync Categoría B "+ Añadir" button in section
    const catBBtn = document.querySelector(`.btn-add-specialty[data-id="${id}"]`);
    if (catBBtn) {
      if (forceSelect) {
        catBBtn.classList.add('selected');
        catBBtn.innerHTML = '<span class="btn-text">✓ Agregado</span>';
      } else {
        catBBtn.classList.remove('selected');
        catBBtn.innerHTML = '<span class="btn-text">+ Añadir</span>';
      }
    }

    // Sync Chip checkbox inside booking card
    const chip = document.querySelector(`.specialty-chip[data-id="${id}"]`);
    if (chip) {
      const checkbox = chip.querySelector('input');
      checkbox.checked = forceSelect;
      if (forceSelect) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    }

    updateSummary();
  }

  // --- Real-time Order Summary Calculation ---
  function updateSummary() {
    let count = 0;
    let total = 0;
    let itemsHtml = '';

    // If package selected
    if (state.selectedPackage) {
      count++;
      total += state.selectedPackage.price;
      itemsHtml += `
        <div class="flex items-center justify-between py-2 border-b border-white/5 bg-gold-500/10 px-2.5 rounded mb-1">
          <div class="flex items-center gap-1.5 truncate pr-2">
            <span class="text-gold-400 font-bold">★</span>
            <span class="font-bold text-white text-xs truncate">${state.selectedPackage.name}</span>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="font-mono text-gold-300 font-bold text-xs">$${state.selectedPackage.price} MXN</span>
            <button type="button" class="btn-remove-summary text-gray-500 hover:text-red-400 text-xs px-1 cursor-pointer" data-action="remove-package" title="Quitar">✕</button>
          </div>
        </div>
      `;
    }

    // If specialties selected
    state.selectedSpecialties.forEach((item) => {
      count++;
      total += item.price;
      itemsHtml += `
        <div class="flex items-center justify-between py-1.5 border-b border-white/5 px-2">
          <div class="flex items-center gap-1.5 truncate pr-2">
            <span class="text-gray-400 text-xs">✂</span>
            <span class="text-gray-300 text-xs truncate">${item.name}</span>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="font-mono text-gray-300 text-xs">$${item.price} MXN</span>
            <button type="button" class="btn-remove-summary text-gray-500 hover:text-red-400 text-xs px-1 cursor-pointer" data-action="remove-specialty" data-id="${item.id}" title="Quitar">✕</button>
          </div>
        </div>
      `;
    });

    if (count === 0) {
      itemsHtml = `
        <div class="py-8 text-center text-gray-500 italic text-xs">
          Aún no has agregado ningún servicio o experiencia.
        </div>
      `;
    }

    if (summaryItemsList) {
      summaryItemsList.innerHTML = itemsHtml;

      // Bind remove buttons inside summary
      summaryItemsList.querySelectorAll('.btn-remove-summary').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          if (action === 'remove-package') {
            clearPackage();
          } else if (action === 'remove-specialty') {
            const id = btn.dataset.id;
            toggleSpecialty(id, '', 0, false);
          }
        });
      });
    }

    if (summaryCountServices) summaryCountServices.textContent = count;
    if (summaryTotalPrice) summaryTotalPrice.textContent = `$${total}`;
  }

  // --- Dynamic Time Slots Generation ---
  function bindFormEvents() {
    // Date selection change
    if (appointmentDateInput) {
      appointmentDateInput.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;

        state.selectedDate = val;
        updateDatePreview(val);
        generateTimeSlots(val);
      });
    }

    // Client form inputs
    if (clientNameInput) {
      clientNameInput.addEventListener('input', (e) => {
        state.clientName = e.target.value.trim();
        document.getElementById('err-client-name').classList.add('hidden');
      });
    }

    if (clientPhoneInput) {
      clientPhoneInput.addEventListener('input', (e) => {
        state.clientPhone = e.target.value.trim();
        document.getElementById('err-client-phone').classList.add('hidden');
      });
    }

    if (clientNotesInput) {
      clientNotesInput.addEventListener('input', (e) => {
        state.clientNotes = e.target.value.trim();
      });
    }

    // Form submit
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingSubmit);
    }
  }

  function updateDatePreview(dateStr) {
    if (!previewDate) return;
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      const formatted = d.toLocaleDateString('es-MX', options);
      previewDate.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      previewDate.textContent = dateStr;
    }
  }

  function generateTimeSlots(dateStr) {
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';
    state.selectedTime = '';
    if (selectedTimeInput) selectedTimeInput.value = '';
    if (previewTime) previewTime.textContent = 'Por definir';

    // Parse date safely
    const [year, month, dayNum] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, dayNum);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1..6 = Mon..Sat

    // Schedule rules:
    // Lunes a Sábado: 10:00 a.m. a 8:00 p.m. (bloques cada 30 min)
    // Domingo: 10:00 a.m. a 6:00 p.m.
    const isSunday = (dayOfWeek === 0);
    const endHour = isSunday ? 18 : 20; // 6 PM or 8 PM

    if (slotsRangeBadge) {
      slotsRangeBadge.textContent = isSunday ? 'Domingo: 10:00 AM - 6:00 PM' : 'Lunes-Sábado: 10:00 AM - 8:00 PM';
    }

    if (dayScheduleHint) {
      dayScheduleHint.innerHTML = isSunday
        ? `<span class="text-gold-400 font-bold">⚡ Horario Dominical:</span> Bloques de atención de 10:00 a.m. a 6:00 p.m.`
        : `<span class="text-gold-400 font-bold">⚡ Horario Regular:</span> Bloques de atención de 10:00 a.m. a 8:00 p.m.`;
    }

    const now = new Date();
    const isToday = (
      now.getFullYear() === year &&
      now.getMonth() === (month - 1) &&
      now.getDate() === dayNum
    );

    const slots = [];
    for (let hour = 10; hour <= endHour; hour++) {
      const minuteOptions = (hour === endHour) ? [0] : [0, 30];
      for (const minute of minuteOptions) {
        const timeStr24 = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        // Format 12-hour AM/PM
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayTime = `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;

        // Check if disabled because time has passed today (with 15 min buffer)
        let isDisabled = false;
        if (isToday) {
          const slotDateTime = new Date(year, month - 1, dayNum, hour, minute);
          if (slotDateTime.getTime() <= (now.getTime() + 15 * 60 * 1000)) {
            isDisabled = true;
          }
        }

        slots.push({ time24: timeStr24, display: displayTime, disabled: isDisabled });
      }
    }

    if (slots.length === 0) {
      slotsContainer.innerHTML = `
        <div class="col-span-full py-6 text-center text-gray-500 text-xs">
          No hay horarios disponibles para la fecha seleccionada.
        </div>
      `;
      return;
    }

    slots.forEach(slot => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `time-slot-btn slot-pill ${slot.disabled ? 'disabled' : ''}`;
      pill.textContent = slot.display;
      pill.dataset.time = slot.display;

      if (!slot.disabled) {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.time-slot-btn').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.selectedTime = slot.display;
          if (selectedTimeInput) selectedTimeInput.value = slot.display;
          if (previewTime) previewTime.textContent = slot.display;
          document.getElementById('err-time-slot').classList.add('hidden');
        });
      }

      slotsContainer.appendChild(pill);
    });
  }

  // --- Form Validation & Booking Submission ---
  function handleBookingSubmit(e) {
    e.preventDefault();

    let hasErrors = false;

    // 1. Validate service selection (must have package OR at least 1 specialty)
    const totalServices = (state.selectedPackage ? 1 : 0) + state.selectedSpecialties.size;
    if (totalServices === 0) {
      showToast('Por favor selecciona al menos una experiencia o servicio.', 'error');
      document.getElementById('experiencias').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 2. Validate client name
    const nameVal = clientNameInput.value.trim();
    if (!nameVal || nameVal.length < 3) {
      document.getElementById('err-client-name').classList.remove('hidden');
      clientNameInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-client-name').classList.add('hidden');
    }

    // 3. Validate client phone (at least 10 digits)
    const phoneVal = clientPhoneInput.value.replace(/\D/g, '');
    if (!phoneVal || phoneVal.length < 10) {
      document.getElementById('err-client-phone').classList.remove('hidden');
      if (!hasErrors) clientPhoneInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-client-phone').classList.add('hidden');
    }

    // 4. Validate appointment date
    const dateVal = appointmentDateInput.value;
    if (!dateVal) {
      document.getElementById('err-appointment-date').classList.remove('hidden');
      if (!hasErrors) appointmentDateInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-appointment-date').classList.add('hidden');
    }

    // 5. Validate time slot
    if (!state.selectedTime) {
      document.getElementById('err-time-slot').classList.remove('hidden');
      hasErrors = true;
    } else {
      document.getElementById('err-time-slot').classList.add('hidden');
    }

    if (hasErrors) {
      showToast('Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    // All validations passed! Generate reservation
    createAppointment({
      name: nameVal,
      phone: phoneVal,
      date: dateVal,
      time: state.selectedTime,
      notes: clientNotesInput.value.trim()
    });
  }

  function createAppointment(details) {
    // Generate unique Folio: CAV-XXXXX
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const folio = `CAV-${randomCode}`;

    // Collect list of items & total
    const items = [];
    let grandTotal = 0;

    if (state.selectedPackage) {
      items.push({
        name: `★ ${state.selectedPackage.name}`,
        price: state.selectedPackage.price,
        type: 'package'
      });
      grandTotal += state.selectedPackage.price;
    }

    state.selectedSpecialties.forEach(spec => {
      items.push({
        name: spec.name,
        price: spec.price,
        type: 'specialty'
      });
      grandTotal += spec.price;
    });

    const appointment = {
      folio,
      createdAt: new Date().toISOString(),
      clientName: details.name,
      clientPhone: details.phone,
      date: details.date,
      time: details.time,
      notes: details.notes,
      items,
      total: grandTotal,
      status: 'Confirmada en App'
    };

    // Save to localStorage
    state.appointments.unshift(appointment);
    localStorage.setItem('cavernicolas_appointments', JSON.stringify(state.appointments));
    updateMyAppointmentsBadge();

    // Show Digital Ticket Modal
    renderDigitalTicket(appointment);
    showToast(`¡Cita registrada con éxito! Folio: ${folio}`);
  }

  // --- Render Digital Ticket & WhatsApp Message ---
  function renderDigitalTicket(appointment) {
    document.getElementById('ticket-folio').textContent = `#${appointment.folio}`;
    document.getElementById('ticket-client-name').textContent = appointment.clientName;
    document.getElementById('ticket-client-phone').textContent = formatPhone(appointment.clientPhone);

    // Format Date
    const parts = appointment.date.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('es-MX', options);
    document.getElementById('ticket-date').textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById('ticket-time').textContent = appointment.time;

    // Services breakdown
    const ticketServicesList = document.getElementById('ticket-services-list');
    ticketServicesList.innerHTML = '';
    appointment.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center py-1';
      row.innerHTML = `
        <span class="text-gray-300 ${item.type === 'package' ? 'font-bold text-gold-300' : ''}">${item.name}</span>
        <span class="font-mono text-white font-medium">$${item.price} MXN</span>
      `;
      ticketServicesList.appendChild(row);
    });

    document.getElementById('ticket-total').textContent = `$${appointment.total}`;

    // Notes
    const notesContainer = document.getElementById('ticket-notes-container');
    const notesText = document.getElementById('ticket-notes-text');
    if (appointment.notes) {
      notesText.textContent = appointment.notes;
      notesContainer.classList.remove('hidden');
    } else {
      notesContainer.classList.add('hidden');
    }

    // Build WhatsApp Message Link
    const waUrl = buildWhatsAppReservationUrl(appointment);
    if (btnTicketWhatsapp) {
      btnTicketWhatsapp.href = waUrl;
    }

    // Open ticket modal
    modalTicket.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function buildWhatsAppReservationUrl(appointment) {
    const phoneNumber = '529983374945';
    
    // Services bullet list for message
    let servicesText = '';
    appointment.items.forEach(item => {
      servicesText += `  • ${item.name} ($${item.price} MXN)\n`;
    });

    // Notes line
    const notesLine = appointment.notes ? `\n📝 *Notas:* ${appointment.notes}\n` : '';

    const message = 
`💈 *RESERVA CAVERNÍCOLAS BARBERSHOP* 💈
━━━━━━━━━━━━━━━━━━━━
• *Folio:* #${appointment.folio}
• *Cliente:* ${appointment.clientName}
• *Teléfono:* ${appointment.clientPhone}
• *Fecha:* ${appointment.date}
• *Horario:* ${appointment.time}

✂ *Servicios Solicitados:*
${servicesText}
💰 *Total a Liquidar:* $${appointment.total} MXN${notesLine}
📍 *Sucursal:* Calle Prol. Av. Kabáh 1, Paseos Kabah, Cancún, Q.R.
━━━━━━━━━━━━━━━━━━━━
_Hola, acabo de registrar mi cita en la aplicación web y deseo confirmar disponibilidad._`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  // --- Modal Events ---
  function bindModalEvents() {
    // Ticket Modal close
    if (btnCloseTicket) {
      btnCloseTicket.addEventListener('click', closeTicketModal);
    }
    if (btnCloseTicketX) {
      btnCloseTicketX.addEventListener('click', closeTicketModal);
    }
    if (btnPrintTicket) {
      btnPrintTicket.addEventListener('click', () => {
        window.print();
      });
    }

    // Close when clicking backdrop
    if (modalTicket) {
      modalTicket.addEventListener('click', (e) => {
        if (e.target === modalTicket) closeTicketModal();
      });
    }

    // Mis Citas Modal open/close
    if (btnOpenMyAppointments) {
      btnOpenMyAppointments.addEventListener('click', openMyAppointmentsModal);
    }
    if (btnOpenMyAppointmentsMobile) {
      btnOpenMyAppointmentsMobile.addEventListener('click', openMyAppointmentsModal);
    }
    if (btnCloseMyAppointments) {
      btnCloseMyAppointments.addEventListener('click', closeMyAppointmentsModal);
    }
    if (btnCloseMyAppointmentsX) {
      btnCloseMyAppointmentsX.addEventListener('click', closeMyAppointmentsModal);
    }
    if (modalMyAppointments) {
      modalMyAppointments.addEventListener('click', (e) => {
        if (e.target === modalMyAppointments) closeMyAppointmentsModal();
      });
    }

    // ESC key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeTicketModal();
        closeMyAppointmentsModal();
      }
    });
  }

  function closeTicketModal() {
    if (modalTicket) {
      modalTicket.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function openMyAppointmentsModal() {
    renderMyAppointmentsList();
    if (modalMyAppointments) {
      modalMyAppointments.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMyAppointmentsModal() {
    if (modalMyAppointments) {
      modalMyAppointments.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  function renderMyAppointmentsList() {
    if (!myAppointmentsList) return;
    myAppointmentsList.innerHTML = '';

    if (state.appointments.length === 0) {
      myAppointmentsList.innerHTML = `
        <div class="py-12 text-center text-gray-500">
          <span class="text-3xl block mb-2">📅</span>
          <p class="text-sm">No tienes citas registradas en este navegador.</p>
          <a href="#reservar" class="text-gold-400 hover:underline text-xs mt-2 inline-block" onclick="document.getElementById('modal-my-appointments').classList.add('hidden'); document.body.style.overflow = '';">
            Agendar una cita ahora →
          </a>
        </div>
      `;
      return;
    }

    state.appointments.forEach((apt, index) => {
      const card = document.createElement('div');
      card.className = 'bg-carbon-800 p-4 rounded-xl border border-white/5 space-y-3';
      
      const servicesNames = apt.items.map(i => i.name).join(', ');
      const waUrl = buildWhatsAppReservationUrl(apt);

      card.innerHTML = `
        <div class="flex items-center justify-between pb-2 border-b border-white/5">
          <span class="font-mono text-gold-400 font-bold text-sm">#${apt.folio}</span>
          <span class="status-badge-live open text-[10px]">Cita Guardada</span>
        </div>
        <div class="text-xs space-y-1">
          <p><strong class="text-gray-400">Cliente:</strong> <span class="text-white">${apt.clientName}</span></p>
          <p><strong class="text-gray-400">Fecha y Hora:</strong> <span class="text-gold-300 font-semibold">${apt.date} a las ${apt.time}</span></p>
          <p><strong class="text-gray-400">Servicios:</strong> <span class="text-gray-300">${servicesNames}</span></p>
          <p><strong class="text-gray-400">Total:</strong> <span class="text-gold-400 font-mono font-bold">$${apt.total} MXN</span></p>
        </div>
        <div class="flex items-center gap-2 pt-2 border-t border-white/5">
          <a href="${waUrl}" target="_blank" rel="noopener" class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors flex-1 text-center font-medium">
            💬 Reenviar WhatsApp
          </a>
          <button type="button" class="btn-cancel-apt text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer" data-index="${index}">
            Cancelar Cita
          </button>
        </div>
      `;

      myAppointmentsList.appendChild(card);
    });

    // Bind cancellation buttons
    myAppointmentsList.querySelectorAll('.btn-cancel-apt').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (confirm('¿Estás seguro de que deseas cancelar esta cita guardada?')) {
          state.appointments.splice(idx, 1);
          localStorage.setItem('cavernicolas_appointments', JSON.stringify(state.appointments));
          renderMyAppointmentsList();
          updateMyAppointmentsBadge();
          showToast('Cita cancelada con éxito.');
        }
      });
    });
  }

  function updateMyAppointmentsBadge() {
    const count = state.appointments.length;
    if (badgeMyAppointments) {
      if (count > 0) {
        badgeMyAppointments.textContent = count;
        badgeMyAppointments.classList.remove('hidden');
      } else {
        badgeMyAppointments.classList.add('hidden');
      }
    }
  }

  // --- Toast Notifications ---
  function showToast(msg, type = 'success') {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    const toastIcon = document.getElementById('toast-icon');
    if (toastIcon) {
      toastIcon.textContent = type === 'error' ? '⚠️' : '✓';
      toastIcon.className = type === 'error' ? 'text-red-400 text-lg' : 'text-gold-400 text-lg';
    }

    toast.classList.remove('hidden');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }

  // --- Helper: Format Phone ---
  function formatPhone(digits) {
    if (!digits) return '';
    const clean = digits.replace(/\D/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
    }
    return digits;
  }
});
