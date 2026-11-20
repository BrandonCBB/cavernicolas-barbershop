/**
 * Cabernicolas Barbershop - Core Application Logic
 * Modern, responsive booking system with WhatsApp confirmation flow
 * Bespoke Editorial Luxury Edition
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
    appointments: JSON.parse(localStorage.getItem('cabernicolas_appointments') || localStorage.getItem('cavernicolas_appointments') || '[]')
  };

  // Specialty services master list
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
    // Cancun / Quintana Roo (UTC-5)
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
        shopLiveStatus.innerHTML = `<span style="color: var(--status-emerald); font-weight: 700;">Abierto Ahora</span> • Paseos Kabah (${scheduleText})`;
      } else {
        shopLiveStatus.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">Cerrado por ahora</span> • Reanudamos a las 10:00 AM (${scheduleText})`;
      }
    }

    if (badgeOpenStatus) {
      if (isOpen) {
        badgeOpenStatus.textContent = 'Abierto Ahora';
        badgeOpenStatus.style.background = 'var(--status-emerald-bg)';
        badgeOpenStatus.style.color = 'var(--status-emerald)';
        badgeOpenStatus.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      } else {
        badgeOpenStatus.textContent = 'Cerrado Ahora';
        badgeOpenStatus.style.background = 'rgba(239, 68, 68, 0.12)';
        badgeOpenStatus.style.color = '#f87171';
        badgeOpenStatus.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      }
    }
  }

  // --- Header Scroll Effect ---
  function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile Menu Toggle ---
  function setupMobileMenu() {
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });

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
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      appointmentDateInput.min = `${yyyy}-${mm}-${dd}`;

      // Max 60 days in advance
      const maxDateObj = new Date();
      maxDateObj.setDate(maxDateObj.getDate() + 60);
      const maxYYYY = maxDateObj.getFullYear();
      const maxMM = String(maxDateObj.getMonth() + 1).padStart(2, '0');
      const maxDD = String(maxDateObj.getDate()).padStart(2, '0');
      appointmentDateInput.max = `${maxYYYY}-${maxMM}-${maxDD}`;
    }
  }

  // --- Render Specialty Chips in Booking Module ---
  function renderSpecialtiesChips() {
    if (!bookingSpecialtiesChips) return;
    bookingSpecialtiesChips.innerHTML = '';

    SPECIALTY_SERVICES.forEach(item => {
      const chip = document.createElement('div');
      chip.className = 'specialty-chip';
      chip.dataset.id = item.id;
      chip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; overflow: hidden; padding-right: 0.25rem;">
          <input type="checkbox" id="chk-${item.id}" style="cursor: pointer;">
          <label for="chk-${item.id}" style="cursor: pointer; font-size: 0.78rem; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</label>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--accent-bronze); white-space: nowrap;">$${item.price}</span>
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
    // Packages in Section 1
    const packageButtons = document.querySelectorAll('.btn-select-package');
    packageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.packageId;
        const name = btn.dataset.packageName;
        const price = parseInt(btn.dataset.packagePrice, 10);
        selectPackage(id, name, price);

        document.getElementById('reservar').scrollIntoView({ behavior: 'smooth' });
        showToast(`Experiencia "${name}" añadida a tu cita.`);
      });
    });

    // Package Buttons inside Booking Tray
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

    // Clear Package Button
    if (btnClearPackage) {
      btnClearPackage.addEventListener('click', () => {
        clearPackage();
      });
    }

    // Specialty Services "+ Añadir" buttons
    const specialtyAddButtons = document.querySelectorAll('.btn-add-specialty');
    specialtyAddButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price, 10);

        const isCurrentlySelected = state.selectedSpecialties.has(id);
        toggleSpecialty(id, name, price, !isCurrentlySelected);

        if (!isCurrentlySelected) {
          showToast(`"${name}" añadido.`);
        }
      });
    });
  }

  function selectPackage(id, name, price) {
    state.selectedPackage = { id, name, price };

    // Update Quick Picker Buttons
    document.querySelectorAll('.btn-picker-pkg').forEach(btn => {
      if (btn.dataset.pkgId === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Section 1 cards
    document.querySelectorAll('.experience-item').forEach(card => {
      const cardBtn = card.querySelector('.btn-select-package');
      if (cardBtn && cardBtn.dataset.packageId === id) {
        cardBtn.classList.add('active-selected');
        cardBtn.textContent = '✓ Seleccionada';
      } else if (cardBtn) {
        cardBtn.classList.remove('active-selected');
        const defaultName = cardBtn.dataset.packageName.replace(/Cavern[íi]colas\s*/i, '').replace(/Cabern[íi]colas\s*/i, '');
        cardBtn.textContent = `Seleccionar ${defaultName}`;
      }
    });

    if (selectedPkgDisplay) {
      selectedPkgDisplay.innerHTML = `<strong style="color: var(--text-primary);">★ ${name}</strong> — <span style="color: var(--accent-bronze); font-family: var(--font-mono); font-weight: 700;">$${price} MXN</span>`;
    }
    if (btnClearPackage) {
      btnClearPackage.classList.remove('hidden');
    }

    updateSummary();
  }

  function clearPackage() {
    state.selectedPackage = null;
    document.querySelectorAll('.btn-picker-pkg').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.experience-item').forEach(card => {
      const cardBtn = card.querySelector('.btn-select-package');
      if (cardBtn) {
        cardBtn.classList.remove('active-selected');
        const defaultName = cardBtn.dataset.packageName.replace(/Cavern[íi]colas\s*/i, '').replace(/Cabern[íi]colas\s*/i, '');
        cardBtn.textContent = `Seleccionar ${defaultName}`;
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

    // Sync button in Section 2
    const catBBtn = document.querySelector(`.btn-add-specialty[data-id="${id}"]`);
    if (catBBtn) {
      if (forceSelect) {
        catBBtn.classList.add('selected');
        catBBtn.textContent = '✓ Agregado';
      } else {
        catBBtn.classList.remove('selected');
        catBBtn.textContent = '+ Añadir';
      }
    }

    // Sync Chip in Booking Module
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
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.75rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); margin-bottom: 0.45rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; padding-right: 0.5rem;">
            <span style="color: var(--accent-bronze); font-size: 0.75rem;">★</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${state.selectedPackage.name}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <span style="font-family: var(--font-mono); font-size: 0.82rem; font-weight: 700; color: var(--accent-bronze);">$${state.selectedPackage.price} MXN</span>
            <button type="button" class="btn-remove-summary" data-action="remove-package" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; padding: 0 0.2rem;" title="Quitar">✕</button>
          </div>
        </div>
      `;
    }

    // If specialties selected
    state.selectedSpecialties.forEach((item) => {
      count++;
      total += item.price;
      itemsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0.5rem; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; gap: 0.4rem; overflow: hidden; padding-right: 0.5rem;">
            <span style="color: var(--text-muted); font-size: 0.72rem;">—</span>
            <span style="font-size: 0.78rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0;">
            <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-primary);">$${item.price} MXN</span>
            <button type="button" class="btn-remove-summary" data-action="remove-specialty" data-id="${item.id}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; padding: 0 0.2rem;" title="Quitar">✕</button>
          </div>
        </div>
      `;
    });

    if (count === 0) {
      itemsHtml = `
        <div style="padding: 2.5rem 0; text-align: center; color: var(--text-muted); font-size: 0.82rem; font-style: italic;">
          Aún no has agregado ningún servicio o experiencia.
        </div>
      `;
    }

    if (summaryItemsList) {
      summaryItemsList.innerHTML = itemsHtml;

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

  // --- Form & Dynamic Slot Generation ---
  function bindFormEvents() {
    if (appointmentDateInput) {
      appointmentDateInput.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;

        state.selectedDate = val;
        updateDatePreview(val);
        generateTimeSlots(val);
      });
    }

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

    const [year, month, dayNum] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, dayNum);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1..6 is Mon..Sat

    // Schedule:
    // Mon-Sat: 10:00 a.m. - 8:00 p.m.
    // Sunday: 10:00 a.m. - 6:00 p.m.
    const isSunday = (dayOfWeek === 0);
    const endHour = isSunday ? 18 : 20;

    if (slotsRangeBadge) {
      slotsRangeBadge.textContent = isSunday ? 'Domingo: 10:00 AM – 6:00 PM' : 'Lunes–Sábado: 10:00 AM – 8:00 PM';
    }

    if (dayScheduleHint) {
      dayScheduleHint.innerHTML = isSunday
        ? `<strong style="color: var(--accent-bronze);">Horario Dominical:</strong> Bloques disponibles de 10:00 a.m. a 6:00 p.m.`
        : `<strong style="color: var(--accent-bronze);">Horario Regular:</strong> Bloques disponibles de 10:00 a.m. a 8:00 p.m.`;
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
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const displayTime = `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;

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
        <div style="grid-column: 1/-1; padding: 2rem 0; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          No hay horarios disponibles para la fecha seleccionada.
        </div>
      `;
      return;
    }

    slots.forEach(slot => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `time-slot-btn ${slot.disabled ? 'disabled' : ''}`;
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

  // --- Validation & Submission ---
  function handleBookingSubmit(e) {
    e.preventDefault();

    let hasErrors = false;

    // 1. Service selected
    const totalServices = (state.selectedPackage ? 1 : 0) + state.selectedSpecialties.size;
    if (totalServices === 0) {
      showToast('Selecciona al menos una experiencia o servicio.', 'error');
      document.getElementById('experiencias').scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 2. Client Name
    const nameVal = clientNameInput.value.trim();
    if (!nameVal || nameVal.length < 3) {
      document.getElementById('err-client-name').classList.remove('hidden');
      clientNameInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-client-name').classList.add('hidden');
    }

    // 3. Client Phone
    const phoneVal = clientPhoneInput.value.replace(/\D/g, '');
    if (!phoneVal || phoneVal.length < 10) {
      document.getElementById('err-client-phone').classList.remove('hidden');
      if (!hasErrors) clientPhoneInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-client-phone').classList.add('hidden');
    }

    // 4. Date
    const dateVal = appointmentDateInput.value;
    if (!dateVal) {
      document.getElementById('err-appointment-date').classList.remove('hidden');
      if (!hasErrors) appointmentDateInput.focus();
      hasErrors = true;
    } else {
      document.getElementById('err-appointment-date').classList.add('hidden');
    }

    // 5. Time Slot
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

    // Create reservation
    createAppointment({
      name: nameVal,
      phone: phoneVal,
      date: dateVal,
      time: state.selectedTime,
      notes: clientNotesInput.value.trim()
    });
  }

  function createAppointment(details) {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const folio = `CAV-${randomCode}`;

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

    state.appointments.unshift(appointment);
    localStorage.setItem('cabernicolas_appointments', JSON.stringify(state.appointments));
    updateMyAppointmentsBadge();

    renderDigitalTicket(appointment);
    showToast(`¡Cita registrada con éxito! Folio: ${folio}`);
  }

  // --- Render Digital Ticket & WhatsApp Link ---
  function renderDigitalTicket(appointment) {
    document.getElementById('ticket-folio').textContent = `#${appointment.folio}`;
    document.getElementById('ticket-client-name').textContent = appointment.clientName;
    document.getElementById('ticket-client-phone').textContent = formatPhone(appointment.clientPhone);

    const parts = appointment.date.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('es-MX', options);
    document.getElementById('ticket-date').textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById('ticket-time').textContent = appointment.time;

    const ticketServicesList = document.getElementById('ticket-services-list');
    ticketServicesList.innerHTML = '';
    appointment.items.forEach(item => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <span style="color: ${item.type === 'package' ? 'var(--text-primary)' : 'var(--text-secondary)'}; font-weight: ${item.type === 'package' ? '700' : '400'};">${item.name}</span>
        <span style="font-family: var(--font-mono); color: var(--text-primary); font-weight: 600;">$${item.price} MXN</span>
      `;
      ticketServicesList.appendChild(row);
    });

    document.getElementById('ticket-total').textContent = `$${appointment.total}`;

    const notesContainer = document.getElementById('ticket-notes-container');
    const notesText = document.getElementById('ticket-notes-text');
    if (appointment.notes) {
      notesText.textContent = appointment.notes;
      notesContainer.classList.remove('hidden');
    } else {
      notesContainer.classList.add('hidden');
    }

    const waUrl = buildWhatsAppReservationUrl(appointment);
    if (btnTicketWhatsapp) {
      btnTicketWhatsapp.href = waUrl;
    }

    modalTicket.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function buildWhatsAppReservationUrl(appointment) {
    const phoneNumber = '529983374945';
    let servicesText = '';
    appointment.items.forEach(item => {
      servicesText += `  • ${item.name} ($${item.price} MXN)\n`;
    });

    const notesLine = appointment.notes ? `\n📝 *Notas:* ${appointment.notes}\n` : '';

    const message = 
`💈 *RESERVA CABERNICOLAS BARBERSHOP* 💈
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
_Hola, acabo de registrar mi cita en la plataforma web y deseo confirmar disponibilidad._`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }

  // --- Modal Events ---
  function bindModalEvents() {
    if (btnCloseTicket) btnCloseTicket.addEventListener('click', closeTicketModal);
    if (btnCloseTicketX) btnCloseTicketX.addEventListener('click', closeTicketModal);
    if (btnPrintTicket) btnPrintTicket.addEventListener('click', () => window.print());

    if (modalTicket) {
      modalTicket.addEventListener('click', (e) => {
        if (e.target === modalTicket) closeTicketModal();
      });
    }

    if (btnOpenMyAppointments) btnOpenMyAppointments.addEventListener('click', openMyAppointmentsModal);
    if (btnOpenMyAppointmentsMobile) btnOpenMyAppointmentsMobile.addEventListener('click', openMyAppointmentsModal);
    if (btnCloseMyAppointments) btnCloseMyAppointments.addEventListener('click', closeMyAppointmentsModal);
    if (btnCloseMyAppointmentsX) btnCloseMyAppointmentsX.addEventListener('click', closeMyAppointmentsModal);

    if (modalMyAppointments) {
      modalMyAppointments.addEventListener('click', (e) => {
        if (e.target === modalMyAppointments) closeMyAppointmentsModal();
      });
    }

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
        <div style="padding: 3rem 0; text-align: center; color: var(--text-muted);">
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">📅</span>
          <p style="font-size: 0.88rem;">No tienes citas registradas en este navegador.</p>
          <a href="#reservar" style="color: var(--accent-bronze); font-size: 0.78rem; text-decoration: underline; margin-top: 0.5rem; display: inline-block;" onclick="document.getElementById('modal-my-appointments').classList.add('hidden'); document.body.style.overflow = '';">
            Agendar una cita ahora →
          </a>
        </div>
      `;
      return;
    }

    state.appointments.forEach((apt, index) => {
      const card = document.createElement('div');
      card.style.background = 'var(--bg-deep)';
      card.style.padding = '1.25rem';
      card.style.borderRadius = 'var(--radius-xs)';
      card.style.border = '1px solid var(--border-subtle)';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '0.75rem';

      const servicesNames = apt.items.map(i => i.name).join(', ');
      const waUrl = buildWhatsAppReservationUrl(apt);

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--accent-bronze);">#${apt.folio}</span>
          <span style="font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-pill); background: var(--status-emerald-bg); color: var(--status-emerald);">Cita Guardada</span>
        </div>
        <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <p><strong style="color: var(--text-muted);">Cliente:</strong> <span style="color: var(--text-primary); font-weight: 500;">${apt.clientName}</span></p>
          <p><strong style="color: var(--text-muted);">Fecha y Hora:</strong> <span style="color: var(--text-primary); font-weight: 600;">${apt.date} a las ${apt.time}</span></p>
          <p><strong style="color: var(--text-muted);">Servicios:</strong> <span style="color: var(--text-secondary);">${servicesNames}</span></p>
          <p><strong style="color: var(--text-muted);">Total:</strong> <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-bronze);">$${apt.total} MXN</span></p>
        </div>
        <div style="display: flex; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
          <a href="${waUrl}" target="_blank" rel="noopener" style="flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; background: rgba(37, 211, 102, 0.15); color: #25D366; border: 1px solid rgba(37, 211, 102, 0.3); padding: 0.5rem; border-radius: var(--radius-xs);">
            Reenviar WhatsApp
          </a>
          <button type="button" class="btn-cancel-apt" data-index="${index}" style="font-size: 0.75rem; color: #f87171; background: transparent; border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.5rem 0.75rem; border-radius: var(--radius-xs); cursor: pointer;">
            Cancelar Cita
          </button>
        </div>
      `;

      myAppointmentsList.appendChild(card);
    });

    myAppointmentsList.querySelectorAll('.btn-cancel-apt').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (confirm('¿Estás seguro de que deseas cancelar esta cita guardada?')) {
          state.appointments.splice(idx, 1);
          localStorage.setItem('cabernicolas_appointments', JSON.stringify(state.appointments));
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
      toastIcon.style.color = type === 'error' ? '#f87171' : 'var(--accent-bronze)';
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
