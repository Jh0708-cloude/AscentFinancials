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

   Ya configurado para el proyecto ascentfinancials-cfbe4.
   La apiKey es pública por diseño: va en todo sitio web con Firebase.
   Lo que protege los datos son las reglas de Firestore, no esta llave.
   ══════════════════════════════════════════════════════════════════ */
window.AF_FIREBASE = {
  apiKey:            "AIzaSyDUhgIhL-3OUwkeNJ7GPjKbuFcUH4MlYPw",
  authDomain:        "ascentfinancials-cfbe4.firebaseapp.com",
  projectId:         "ascentfinancials-cfbe4",
  storageBucket:     "ascentfinancials-cfbe4.firebasestorage.app",
  messagingSenderId: "396410705027",
  appId:             "1:396410705027:web:55a16a1682cd0be32ab7b6"
};
