/**
 * Custom Report UI — inline calendars (no native date picker overlay).
 * UI layer only; report logic stays in custom-period-report.js.
 */
(function (global) {
  'use strict';

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function isoFromDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function parseIso(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const parts = iso.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDisplay(iso) {
    const d = parseIso(iso);
    if (!d) return 'Tap a date below';
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function monthLabel(year, month) {
    return new Date(year, month, 1).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  }

  function buildMonthGrid(year, month, getSelectedIso, onSelect) {
    const wrap = document.createElement('div');
    wrap.className = 'custom-cal';

    const head = document.createElement('div');
    head.className = 'custom-cal-head';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'custom-cal-nav';
    prev.setAttribute('aria-label', 'Previous month');
    prev.textContent = '‹';
    const title = document.createElement('span');
    title.className = 'custom-cal-title';
    title.textContent = monthLabel(year, month);
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'custom-cal-nav';
    next.setAttribute('aria-label', 'Next month');
    next.textContent = '›';
    head.appendChild(prev);
    head.appendChild(title);
    head.appendChild(next);
    wrap.appendChild(head);

    const weekdays = document.createElement('div');
    weekdays.className = 'custom-cal-weekdays';
    WEEKDAYS.forEach(function (w) {
      const el = document.createElement('span');
      el.textContent = w;
      weekdays.appendChild(el);
    });
    wrap.appendChild(weekdays);

    const grid = document.createElement('div');
    grid.className = 'custom-cal-grid';
    wrap.appendChild(grid);

    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayIso = isoFromDate(new Date());

    for (let i = 0; i < startPad; i++) {
      const blank = document.createElement('span');
      blank.className = 'custom-cal-day is-empty';
      blank.setAttribute('aria-hidden', 'true');
      grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const iso = isoFromDate(d);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-cal-day';
      btn.textContent = String(day);
      btn.setAttribute('aria-label', formatDisplay(iso));
      if (iso === getSelectedIso()) btn.classList.add('is-selected');
      if (iso === todayIso) btn.classList.add('is-today');
      btn.addEventListener('click', function () {
        onSelect(iso);
      });
      grid.appendChild(btn);
    }

    prev.addEventListener('click', function () {
      const m = month - 1;
      const y = m < 0 ? year - 1 : year;
      const nm = (m + 12) % 12;
      rerender(y, nm);
    });
    next.addEventListener('click', function () {
      const m = month + 1;
      const y = m > 11 ? year + 1 : year;
      const nm = m % 12;
      rerender(y, nm);
    });

    function rerender(y, m) {
      const parent = wrap.parentNode;
      const newEl = buildMonthGrid(y, m, getSelectedIso, onSelect);
      parent.replaceChild(newEl, wrap);
    }

    return wrap;
  }

  function mountCalendar(opts) {
    const container = opts.container;
    const input = opts.input;
    const display = opts.display;
    const onChange = opts.onChange || function () {};
    if (!container || !input) return;

    let viewYear = new Date().getFullYear();
    let viewMonth = new Date().getMonth();
    const initial = parseIso(input.value);
    if (initial) {
      viewYear = initial.getFullYear();
      viewMonth = initial.getMonth();
    }

    function select(iso) {
      input.value = iso;
      if (display) display.textContent = formatDisplay(iso);
      render();
      onChange(iso);
    }

    function render() {
      container.innerHTML = '';
      container.appendChild(
        buildMonthGrid(viewYear, viewMonth, function () {
          return input.value || null;
        }, function (iso) {
          select(iso);
        })
      );
    }

    render();
    return { setValue: select, refresh: render };
  }

  function mountPair(opts) {
    const startInput = opts.startInput;
    const endInput = opts.endInput;
    const onChange = opts.onChange || function () {};

    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    if (startInput && !startInput.value) startInput.value = isoFromDate(monthAgo);
    if (endInput && !endInput.value) endInput.value = isoFromDate(now);

    if (opts.startDisplay && startInput) {
      opts.startDisplay.textContent = formatDisplay(startInput.value);
    }
    if (opts.endDisplay && endInput) {
      opts.endDisplay.textContent = formatDisplay(endInput.value);
    }

    mountCalendar({
      container: opts.startContainer,
      input: startInput,
      display: opts.startDisplay,
      onChange: onChange,
    });
    mountCalendar({
      container: opts.endContainer,
      input: endInput,
      display: opts.endDisplay,
      onChange: onChange,
    });
  }

  global.MPCustomReportUI = {
    isoFromDate: isoFromDate,
    formatDisplay: formatDisplay,
    mountCalendar: mountCalendar,
    mountPair: mountPair,
  };
})(typeof window !== 'undefined' ? window : globalThis);
