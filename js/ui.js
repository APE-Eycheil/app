// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS — helpers DOM partagés entre les vues
// ═══════════════════════════════════════════════════════════════════════════════

// ── Réordonnancement (même API que ChooseYourScore) ──────────────────────────
function makeReorderBtns(upHandler, downHandler) {
  const wrap = document.createElement('div');
  wrap.className = 'reorder-wrap';
  const up = document.createElement('button');
  up.type = 'button'; up.className = 'btn reorder-up'; up.title = 'Monter'; up.setAttribute('aria-label', 'Monter'); up.textContent = '↑';
  up.addEventListener('click', upHandler);
  const dn = document.createElement('button');
  dn.type = 'button'; dn.className = 'btn reorder-dn'; dn.title = 'Descendre'; dn.setAttribute('aria-label', 'Descendre'); dn.textContent = '↓';
  dn.addEventListener('click', downHandler);
  wrap.append(up, dn);
  return { wrap, up, dn };
}

function setReorderDisabled(btn, disabled) {
  if (btn) btn.disabled = disabled;
}

function syncReorderBtns(wrappers) {
  const n = wrappers.length;
  wrappers.forEach((el, i) => {
    setReorderDisabled(el.querySelector('.reorder-up'), i === 0);
    setReorderDisabled(el.querySelector('.reorder-dn'), i === n - 1);
  });
}
