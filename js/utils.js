// ═══════════════════════════════════════════════════════════════════════════════
// UTILS — fonctions pures partagées
// ═══════════════════════════════════════════════════════════════════════════════
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "Léa D." → "lea-d@ape.invalid"
function firstnameToEmail(firstname) {
  const slug = firstname.trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug + '@' + AUTH_EMAIL_DOMAIN;
}
