// ═══════════════════════════════════════════════════════════════════════════════
// DATA — seul fichier qui parle à Supabase ; le reste de l'appli appelle ces fonctions.
// ═══════════════════════════════════════════════════════════════════════════════
let db = null;

function initData() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

// ── Authentification ─────────────────────────────────────────────────────────
async function signIn(email, password) {
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Le code d'invitation voyage en métadonnée : la base le vérifie puis l'efface (0002_inscription).
async function signUp(firstname, email, password, inviteCode) {
  const { error } = await db.auth.signUp({
    email,
    password,
    options: { data: { firstname, invite_code: inviteCode } }
  });
  if (error) throw error;
}

async function signOut() {
  await db.auth.signOut();
}

// Profil du compte connecté, ou null sans session.
async function loadOwnProfile() {
  const { data: { session } } = await db.auth.getSession();
  let profile = null;
  if (session) {
    const { data, error } = await db.from('profiles').select('*').eq('id', session.user.id).single();
    if (error) throw error;
    profile = data;
  }
  return profile;
}
