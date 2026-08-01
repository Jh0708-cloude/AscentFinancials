# AscentFinancials

App de finanzas personales. PWA sin build, GitHub Pages, Firebase para
sincronizar. El diseño y las razones de cada decisión están en
[DECISIONES.md](DECISIONES.md) — léelo antes de cambiar nada.

**La meta no es registrar gastos, es dejar de arrastrar deuda.** Por eso el
número grande de la portada es la fecha en que la deuda llega a cero, y se
mueve con cada gasto que registras.

---

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | La app entera |
| `firebase-config.js` | **Tus llaves de Firebase.** Editas esto, no el index |
| `manifest.json` | Para que se instale como app |
| `sw.js` | Caché: abre sin internet |
| `icon-192.png` · `icon-512.png` · `icon-maskable-512.png` | Iconos |
| `DECISIONES.md` | Documento de traspaso |

---

## 1. Publicar en GitHub Pages

Sube todo a la raíz del repo `AscentFinancials`. Luego:

**Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`**

Queda en `https://jh0708-cloude.github.io/AscentFinancials/`

**Las mayúsculas importan** en esa ruta.

---

## 2. Firebase

Crea un proyecto **nuevo** (no reuses el de AscentPeak: reglas, cuotas y datos
quedan separados, y si un día rompes algo en uno no toca al otro).

1. https://console.firebase.google.com → **Agregar proyecto**
2. Dentro del proyecto → **</> (Web)** → registra la app. No necesitas Hosting.
3. Copia el objeto `firebaseConfig` y pégalo en **`firebase-config.js`**
4. **Authentication → Sign-in method → Google → Habilitar**
5. **Authentication → Settings → Dominios autorizados → Agregar dominio:**
   `jh0708-cloude.github.io`
6. **Firestore Database → Crear base de datos → modo producción**
7. Pestaña **Reglas**, pega esto y publica:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{documento=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Esa regla dice: cada quien solo puede leer y escribir lo suyo. Sin ella,
cualquiera con la URL puede ver tus movimientos.

Listo. Abre la app, toca **☁ conectar** arriba a la derecha y entra con Google.

### Si no configuras Firebase

La app funciona igual, guardando solo en ese teléfono. El indicador dice
`☁ local`. Nada se rompe.

---

## 3. Cómo sincroniza

Cada colección (`movs`, `ctas`, `fijos`…) viaja como un documento en
`users/{uid}/af/{colección}`. Lo que cambió no se marca a mano: la app compara
la huella de cada colección contra la última que subió, así ningún guardado se
queda sin avisar.

- Sube 2.5 s después de cada cambio, y reintenta cada minuto
- Sin red guarda igual y sube cuando vuelve
- Último en escribir gana, por colección

El indicador de arriba dice en qué está: `☁ ✓` al día · `☁ 3↑` con cambios
por subir · `☁ sin red` · `☁ conectar` sin sesión.

---

## 4. Al subir una versión nueva

Cambia el número de caché en `sw.js`:

```js
const CACHE='ascentfinancials-v1';   // → v2, v3, …
```

Si no lo tocas, el service worker sigue sirviendo la versión vieja y parece que
tus cambios no se aplicaron.

---

## 5. Personalizar

Todo lo personal vive en el bloque `SEMILLA`, arriba del todo en `index.html`:
sueldo líquido, cuentas, tarjetas, fijos, cuotas y junta. Nada de eso está
clavado en la lógica — cambiando ese bloque la app sirve para otra persona sin
reescribir código.

Los montos van en **céntimos enteros**: `382096` son S/ 3,820.96.

---

## Roadmap

- **v1 (esto)** — registro en tres toques, fijos, eventos, efectivo pendiente,
  fecha de salida, detección de ruleteo, cierre de mes
- **v2** — importar estados de cuenta y reconciliar contra lo manual;
  reconciliación de Plin; cobro a terceros
- **v3** — análisis con la API de Claude, con dos o tres meses de datos reales.
  Antes no tiene qué leer.
