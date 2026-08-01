/* ══════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE FIREBASE — AscentFinancials

   1. Entra a https://console.firebase.google.com y crea un proyecto
      NUEVO (no reuses el de AscentPeak: reglas y datos separados).
   2. Agrega una app Web (el icono </>). No hace falta Hosting.
   3. Copia el objeto firebaseConfig que te muestra y pégalo abajo.
   4. En Authentication → Sign-in method, activa Google.
   5. En Authentication → Settings → Dominios autorizados, agrega
      jh0708-cloude.github.io
   6. En Firestore Database, crea la base en modo producción y pega
      las reglas que están en README.md.

   Mientras esto siga con "PEGA_AQUI", la app funciona igual pero solo
   guarda en este teléfono. Nada se rompe.
   ══════════════════════════════════════════════════════════════════ */
window.AF_FIREBASE = {
  apiKey:            "PEGA_AQUI",
  authDomain:        "PEGA_AQUI.firebaseapp.com",
  projectId:         "PEGA_AQUI",
  storageBucket:     "PEGA_AQUI.firebasestorage.app",
  messagingSenderId: "PEGA_AQUI",
  appId:             "PEGA_AQUI"
};
