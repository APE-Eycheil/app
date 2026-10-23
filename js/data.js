// ═══════════════════════════════════════════════════════════════════════════════
// DATA — seul fichier qui parle à Supabase ; le reste de l'appli appelle ces fonctions.
// ═══════════════════════════════════════════════════════════════════════════════
let db = null;

function initData() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}
