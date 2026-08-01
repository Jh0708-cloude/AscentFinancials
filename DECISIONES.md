# AscentFinancials — Decisiones y estado del proyecto

> Documento de traspaso. Si una conversación se corta o empiezas una nueva,
> este archivo es la fuente de verdad. Léelo antes de proponer cambios.
>
> Última actualización: 2026-08-01 (rev. 3) · Estado: **v1 en uso** — PWA
> desplegada, Firebase conectado, paleta de AscentPeak aplicada.

---

## 1. Qué es

App de finanzas personales para Jhair (Lima, Perú). Mismo molde que AscentPeak:
PWA sin build, GitHub Pages, Firebase para sincronizar, API de Claude para el
análisis mensual.

**La meta del proyecto no es registrar gastos, es dejar de arrastrar deuda.**
La app tiene que mostrar la consecuencia *antes* del gasto, no el resumen
después. Un resumen a fin de mes llega tarde y no cambia nada.

- Repo nuevo: `Jh0708-cloude/AscentFinancials`
- **Paleta heredada de AscentPeak**, no inventada: fondo `#17141D`, superficies
  `#211C2B`/`#2A2436`, texto `#EDE9F5`, marca `#B39DE8`. El menta `#7BE3AE`
  (el `--leg` de AscentPeak) se reserva para los avisos de "todo bien": si todo
  es lavanda, el verde deja de significar algo. Un solo acento por pantalla.
- Antecesor: `gastos` — un `index.html` con localStorage. **No se evoluciona,
  se reemplaza.** Su modelo mezclaba cuenta con categoría y no tenía ingresos,
  tarjetas ni cierre de mes. Sirve como referencia de UI, no de datos.
- **Las mayúsculas importan** en la ruta de GitHub Pages.

---

## 2. Contexto del usuario

- **Ingreso**: S/ 4500 brutos · **S/ 3820.96 líquidos** (julio 2026).
- **Saldo total de tarjetas: S/ 7,551.65** (medido 01/08, no estimado). **Todo sin
  interés.** El usuario lo estimaba en 5,300 — subestimación del 42%, solo
  visible al juntar las tres tarjetas en un lado.
- **Deuda revolvente real: S/ 6,552.65.** El saldo de la Amex **ya incluye las 12
  cuotas pendientes** (verificado en la app de Interbank el 01/08). Contarlas
  también en `af_cuota` inflaba el arrastre en S/ 999 y atrasaba la fecha de
  salida 20 días.
- **Deuda en cuotas**: Mercadopago, compra del 15/07/2026, **S/ 999.00 en 12 ×
  S/ 83.25, TEA 0.0%**, cargada a la **Black Amex (Interbank)**. Primera cuota
  11/08/2026, última 09/07/2027. Es otra cosa y se cuenta aparte.
- **Junta**: 12 números, enero–diciembre 2026, S/ 1000/mes. **Es el número 12**,
  cobra ~S/ 12,000 en diciembre. **La junta NO paga la deuda** — tiene destino
  propio. La deuda se mata con el sueldo. Decisión del usuario, y el modelo la
  respeta: la junta nunca aparece como plata disponible para abonar.
- **Efectivo disponible**: S/ 810.76 en el débito Interbank (Plin).
- Trabaja y come en casa. **De lunes a viernes casi no gasta.** El gasto se
  concentra en viernes, sábado y domingo.
- Vóley lunes, miércoles y viernes — S/ 5 de pasaje por sesión.
- Patrón declarado: sale, invita, toma taxi cuando podría tomar micro, y compra
  ropa o cosas para el setup gamer por impulso.

### Tarjetas
| Tarjeta | Banco | Saldo S/ | En cuotas | Revolvente | Línea | Uso | Corte | Vence | Uso real |
|---|---|---|---|---|---|---|---|---|---|
| VISA Oro | BCP | **3,856.18** | 0 | **3,856.18** | 11,740 | 32.8% | ~11 | ~5 | Consumo principal + disposiciones grandes |
| Black Amex | Interbank | **3,695.47** | 999.00 | **2,696.47** | 16,720 | 22.1% | ~10 | ~5 | Fijos, Plin, disposiciones chicas |
| VISA Clásica | BCP | 0 | 0 | 0 | 3,260 | 0% | ~11 | ~5 | Casi muerta (Uber, Steam, PSN) |
| **Total** | | **7,551.65** | **999.00** | **6,552.65** | **31,720** | **23.8%** | | | |

El **saldo** es lo que dice el banco y es lo que se guarda en `af_cta`: si la app
mostrara otro número, nunca cuadraría contra el estado de cuenta. El
**revolvente** es el saldo menos las cuotas pendientes, y es lo único que entra
en la métrica de arrastre y en la fecha de salida.

**Línea disponible: S/ 24,168** — 6.3 sueldos líquidos de pista. Ese es el motivo
por el que nada ha forzado un alto: el límite estructural está tan lejos que el
único freno disponible es la voluntad. Palanca posible (decisión del usuario, no
de la app): **pedir al banco reducir la línea**. Bajarla a ~S/ 12,000 conserva
holgura para emergencias y acorta la pista a la mitad.

(Saldos incluyen el tramo en dólares al tipo de cambio 3.75: US$ 47.36 en Oro,
US$ 23.76 en Amex.)

Yape y Plin están asociados a estas tarjetas. **No son cuentas.**

**El ciclo**: corte el 10-11, vence el 5 del mes siguiente. **Las tres vencen el
mismo día**, así que toda la presión cae el 5, justo después del sueldo. Por eso
el ruleteo se repite idéntico cada mes.

Las fechas son aproximadas ("días más, días menos"), así que `af_cta` las guarda
como **referencia** y el cierre real se ancla al pago detectado, no al
calendario. Pendiente: línea aprobada de cada tarjeta.

---

## 3. Lo que dijeron los datos (mayo–julio 2026, 193 movimientos)

Esta sección existe porque **cambió el diseño**. No es color.

### 3.1 El 83% del gasto es invisible para el banco

Julio 2026, las tres tarjetas juntas:

| | S/ |
|---|---|
| Consumos con tarjeta (visibles) | 1,823 |
| **Disposiciones de efectivo** | **6,649** |
| Plin a personas | 2,185 |
| **Total cargado** | **10,657** |
| Pagado | 8,850 |
| **Crecimiento de la deuda** | **+1,807** |

Junio: 78% invisible. Mayo: 63%. **La proporción está subiendo.**

**Consecuencia de diseño**: una app que solo importe estados de cuenta le
mostraría S/ 1,823 de gasto mensual cuando el real pasa de S/ 10,000.
El registro manual no es un complemento — es el único lugar donde vive el dato.
Todo lo demás del diseño se subordina a que registrar sea barato.

### 3.2 El ruleteo está en los datos, con fecha

- **03/07** — disposición de S/ 1,450 de la Visa Oro; pago de S/ 1,591 a la Visa Oro.
- **31/07** — disposición de S/ 3,100 de la Visa Oro; pago de S/ 2,957 a la Visa
  Oro; pago de S/ 4,140 a la Interbank; y S/ 1,860 en cuatro Plines ese mismo día.

Sacar del banco para pagarle al mismo banco. **Sin interés no cuesta soles:
cuesta la señal.** El mes no cerró y nada avisó.

### 3.3 El Plin no es un préstamo

Consume en la calle, otra persona paga, él devuelve por Plin. **Es gasto suyo al
100%**, solo que llega con nombre de persona y días después. `PLIN.TANIA 500` no
dice si fue trago, taxi o comida — misma caja negra que el efectivo.

### 3.4 Fijos que no estaban declarados y salieron solos

- **Google BitePal AI** — US$ 5.75 semanales. Ya cortado; pasa a plan anual de
  ~S/ 110.
- **Gym Net** — S/ 12 los domingos y feriados (el gym habitual cierra).
- **Anthropic aparece dos veces** y son cosas distintas: la suscripción personal
  (US$ 23.60) y **la API de AscentPeak** (~S/ 22 en julio). Van separadas o no se
  sabe cuánto cuesta su propia app.
- **DirecTV cobrado 3 veces en julio**: S/ 130 (Oro, 02) + S/ 123 (Interbank, 03)
  + S/ 123 (Interbank, 06). Son dos servicios contratados (TV e internet), así
  que **dos cargos son correctos y uno sobra**. El 09/06 se validó la Visa Oro
  con S/ 1 — ahí quedó registrada como segundo medio de pago. Mayo y junio
  tuvieron un solo cargo. **Reclamar ~S/ 123 y anular la tarjeta duplicada**, o
  agosto viene igual.

---

## 4. La métrica primaria

> **Ratio de arrastre = deuda revolvente ÷ ingreso líquido**
> Hoy: 6,552.65 ÷ 3,820.96 = **1.71 meses de sueldo ya gastados.**
> (Antes de separar las cuotas marcaba 1.98 — el saldo de la Amex las incluía.)

Se descartó **tasa de ahorro**: marcaría 0 durante meses y una métrica que no se
mueve no enseña nada. Misma lección que la cintura en AscentPeak — la métrica
tiene que empezar en un número concreto y moverse desde el mes uno.

### El número de portada: la fecha de salida

La deuda se paga **con el sueldo**. Fijos S/ 2,274.33 (junta incluida) sobre
S/ 3,820.96 líquidos dejan **S/ 1,546.63 libres**. Lo que no se gasta, abona.

| Gasto discrecional/mes | Abona | Sin deuda en | Fecha |
|---|---|---|---|
| 0 | 1,547 | 4.2 meses | 08/12/2026 |
| 300 | 1,247 | 5.3 meses | 08/01/2027 |
| **600** | **947** | **6.9 meses** | **28/02/2027** |
| 900 | 647 | 10.1 meses | 05/06/2027 |
| 1,200 | 347 | 18.9 meses | 27/02/2028 |

De ahí sale el único número grande de la portada:

> **Sin deuda el 8 de diciembre de 2026** (si el mes cierra en cero discrecional)

La curva no es lineal: los primeros 300 de gasto cuestan un mes; los últimos 300
cuestan ocho. Por eso el escenario de 1,200 no se muestra como "un poco peor",
sino como lo que es.

**Se recalcula con cada gasto registrado.** Un taxi de S/ 25 mueve la fecha
~0.7 días. Una salida de S/ 300 la mueve 9. Eso es la consecuencia *antes* del
gasto, que era el requisito original — y funciona mejor que una barra de
presupuesto porque no es un límite abstracto impuesto por la app: es la propia
libertad del usuario moviéndose.

**La tasa de ahorro entra en la fase 2**, cuando la deuda llegue a 0. No se puede
ahorrar mientras se financia el mes pasado.

### Por qué el mes 1 no se mide por soles

Julio cerró en **+1,807**. Bajar de golpe a 600 es un salto grande, y una meta
que se rompe la primera semana hace que se deje de registrar y mate la app.
**El objetivo del mes 1 es registrar todo, aunque el número salga feo.**
Sin dato real no hay fecha real, y una fecha inventada se rompe.

---

## 5. Cuadro de fijos (agosto 2026)

| Fijo | Su parte S/ | Nota |
|---|---|---|
| Junta | 1000.00 | **No es gasto: es ahorro ilíquido** |
| Casa | 435.00 | |
| Cochera | 150.00 | |
| Internet | 123.00 | DirecTV, servicio propio |
| ChatGPT | ~90.64 | US$ 24.17 |
| Claude | ~88.50 | US$ 23.60 |
| Vóley | ~65.00 | S/ 5 × 3 días × sem. **Hábito bueno, no se recorta** |
| DirecTV TV | 61.50 | 50% con el hermano (cargo total 123) |
| Seguro mamá | 50.00 | |
| Celular | 39.93 | 50% con el hermano (cargo total 79.85) |
| Spotify | 32.90 | |
| Gym Net | ~30.00 | Domingos y feriados |
| Degravamen | 15.44 | **Revisar de qué crédito viene** |
| BitePal (anual) | ~9.17 | S/ 110 al año |
| Cuota Mercadopago | 83.25 | Vía `af_cuota`, no `af_fijo`. Termina jul 2027 |
| **Total** | **2,274.33** | |

**Libre real: S/ 1,546.63 al mes.** Ese es el número de trabajo de la app.

Aparte y variable: **API de Anthropic para AscentPeak** (~S/ 22/mes). Es costo de
proyecto, no gasto personal.

Suscripciones de IA juntas: ~S/ 270/mes ≈ **S/ 3,240 al año**. `af_fijo` muestra
**costo anual**, no mensual: a 90 al mes no se siente, a 1,088 al año sí. La app
no opina; muestra el número y la decisión es del usuario.

---

## 6. Qué cuenta la app (y qué no)

### 6.1 Los cinco números que importan

1. **Fecha de salida** — el día que la deuda llega a 0 al ritmo actual.
   Es el único número grande de la portada, y se mueve con cada gasto.
2. **Libre del mes** — líquido − fijos − cuotas − eventos agendados.
3. **Findes restantes** — la bolsa se reparte entre los findes que quedan.
   Si un sábado no sale, no pierde: el siguiente finde sube solo.
4. **Efectivo sin registrar** — lo que salió por disposición y todavía no tiene
   destino.
5. **Ratio de arrastre** — deuda revolvente ÷ líquido. Hoy 1.71, meta 0.

### 6.2 Cómo cuenta cada cosa

| Hecho | Qué hace la app |
|---|---|
| Consumo con tarjeta | Sube la deuda de esa tarjeta. **No toca el líquido.** |
| Pago de tarjeta | Traslado de líquido a tarjeta. Baja deuda. **No es gasto.** |
| Disposición de efectivo | Traslado de tarjeta a efectivo. **Abre saldo pendiente de asignar.** No es gasto todavía. |
| Gasto en efectivo | Descarga el saldo de efectivo. **Aquí sí cuenta como gasto.** |
| Plin/Yape a persona | Gasto real. Se enlaza con lo ya anotado o se pregunta después. |
| Sueldo | Ingreso normal. Entra al promedio. |
| CTS / gratificación / junta cobrada | Ingreso con `ext:1`. **Fuera del promedio.** |
| Aporte a la junta | `tipo: ahorro`. Ni gasto ni disponible. |
| Cuota mensual | Fijo agendado con fecha de término. |

### 6.3 Lo que la app deliberadamente NO cuenta

- **No pregunta "¿esto fue impulsivo?"** ni "¿era necesario?". Nadie marca sus
  propios gastos así en caliente, y pone al usuario a discutir consigo mismo
  dentro de la app. **Fijo es objetivo** (está en `af_fijo` o `af_cuota`); todo
  lo demás es variable por descarte. La app clasifica sola.
- **No presupuesta por día.** De lunes a viernes marca cero y el sábado se pasa
  cuatro veces. La unidad es el fin de semana.
- **No hay casilla de "emergencia" sin costo.** En `gastos` decía literal *"no
  cuenta contra el límite"*: un botón de escape a un toque, sin registro. Si se
  mantiene, es **contada y visible**: *"3 emergencias este mes · S/ 420"*.
- **No optimiza uso de tarjetas mientras haya revolvente.** El consejo de
  "compra justo después del cierre" solo aplica si se paga el total del estado de
  cuenta. Con saldo arrastrado, ese consejo empuja a gastar más. La función
  existe pero **se activa sola** cuando el mes cierra completo.
- **No hay multiusuario.** Pero **cero valores personales en el código**:
  moneda, categorías, cuentas y límites viven en `af_cfg`. La app es de una sola
  persona y aun así se puede pasar sin reescribirla. (En `gastos`, "Efectivo IBK"
  estaba clavado en el código y la moneda escrita a mano en `fmt()`.)

---

## 7. Decisiones de producto

| Decisión | Razón |
|---|---|
| **Cuenta y categoría son campos distintos** | En `gastos`, "Efectivo IBK" era una categoría. Mezclaba *en qué gastaste* con *de dónde salió*. Un retiro no es gasto: es traslado. |
| **Yape y Plin son vías, no cuentas** | Si existiera una cuenta "Yape" se pierde de qué tarjeta salió la plata. Son `via`; el origen real siempre es `cta`. |
| **La tarjeta parte el gasto en dos eventos** | Pasar la tarjeta sube deuda; la plata sale semanas después al pagar. Es `prog` vs `sd` de AscentPeak: lo comprometido y lo pagado son dos números. |
| **La disposición abre un saldo, no un gasto** | Sacar 3,100 no es gastar 3,100. La app lleva el efectivo pendiente y lo pide poco a poco. Sin esto, el 83% del gasto no existe. |
| **El ruleteo tiene nombre y contador** | Disposición y pago a la misma cuenta en ≤3 días → se marca solo, va al diario. **El contador no es de soles (no hay interés), es de meses que no cerraron.** |
| **La junta no es gasto** | Son S/ 1000/mes de ahorro ilíquido. Decir "no ahorro nada" es falso: ahorra el 26% del sueldo, pero el ahorro está en la junta y llega en diciembre. |
| **Ser el número 12 se muestra** | Aporta 12 meses y cobra al final: financia su ahorro con deuda. La métrica de arrastre se lee **siempre junto a la fecha de la junta**, o acusa al usuario de algo que en parte no hizo. |
| **La junta no es fuente de pago** | Tiene destino propio. Ningún cálculo de la app la ofrece para abonar deuda, ni siquiera como escenario. La deuda se mata con el sueldo. |
| **El ingreso extraordinario se reparte antes de llegar** | Pasó con la grati de julio: 2,500 tenían dueño y el resto quedó suelto justo cuando había viaje. La decisión se toma en frío, semanas antes, y vive en `af_cfg`. |
| **La Clásica se queda en cero** | Ya está en 0 y casi no se usa. Sirve como reserva real de emergencia con línea limpia; volver a usarla la convierte en una tercera fuente de arrastre. |
| **La fecha de salida reemplaza a la barra de presupuesto** | Un límite es una regla ajena; una fecha es algo propio que se acerca o se aleja. Cada gasto la mueve, y ese movimiento se muestra en el momento del registro. |
| **Cuotas separadas de revolvente** | La cuota tiene fecha de término y se achica sola; lo revolvente no. Mezclarlas es el error del contador de series de AscentPeak. |
| **El saldo del banco manda; el arrastre resta** | `af_cta` guarda el saldo tal cual lo dice el banco (Amex: 3,695.47) o nunca cuadra contra el estado de cuenta. La métrica resta aparte las cuotas pendientes. Guardar el saldo ya "limpio" habría escondido el desfase en vez de explicarlo. |
| **Bolsa mensual, no sobres semanales** | "No sé si voy a gastar el sábado". Con bolsa mensual, el finde que no sale sube el siguiente. Premia quedarse en casa sin felicitar a nadie. |
| **Cumpleaños y regalos se agendan** | Tienen fecha conocida. Se restan de la bolsa **antes** de repartirla. Así no obligan a ruletear. |
| **Compras grandes tienen 48 h, no bloqueo** | Ropa y setup son de S/ 200-800 y se comen un finde de un golpe. Si superan el tope, la app las **agenda** para el finde siguiente. El impulso caduca; la necesidad real no. |
| **Invitar tiene sobre, no prohibición** | Es un hábito social, no un error. Se le da monto y se ve consumir: *"invitaste S/ 640 · 17% de tu líquido"*. Prohibirlo garantiza que reviente y deje de registrar. Regla heredada: nunca castigar el hábito fuerte. |
| **Los compartidos se registran completos** | DirecTV y celular salen enteros de su tarjeta; el hermano devuelve después. Registrar la mitad hace que el saldo de la tarjeta no cuadre nunca. Campo `comp` y el reembolso como movimiento propio. |
| **Mes cerrado es inmutable** | `af_mes` congela límite, gastado e ingreso. Cambiar el plan hoy **nunca** altera un mes cerrado. Es `tp` de AscentPeak. |
| **Montos en céntimos enteros** | Los redondeos de float aparecen recién con 300 movimientos, y para entonces ya contaminaron todo. |
| **Fecha del hecho ≠ fecha de registro** | `d` es cuándo pasó, `ts` cuándo se anotó. En `gastos` solo existía el momento de tipeo: no se podía anotar un gasto de ayer. |
| **`id` único de verdad** | `Date.now()` no sirve para sincronizar sin duplicados. Misma razón que el registro de cardio en AscentPeak. |
| **Moneda original + tipo de cambio** | Claude y ChatGPT están en dólares. Guardar solo el convertido pierde *por qué* subió el mes que subió. |
| **Registro en tres toques** | Monto → categoría → guardar. Cuenta y vía se prellenan con la última usada en esa categoría. Todo editable. **Si registrar cuesta, en dos semanas la app está vacía** — ya pasó con NutriTrack. |

---

## 8. Modelo de datos

Todos los montos en **céntimos enteros** (`c`). Prefijo `af_`.

### `af_cfg`
```
{ v, cur:"PEN", fxDefault, liquido, corte, categorias:[], metrica }
```
Cero valores personales en el código. Todo lo que sea de Jhair vive acá.

### `af_cta` — cuentas y tarjetas
```
{ id, n, tipo:liquida|credito|efectivo, banco, linea, cierre, vence,
  comDisp, activa }
```
`efectivo` es una cuenta real: es donde cae lo que sale por disposición.

### `af_mov` — movimientos
```
{ id, d, ts, c, cur, fx,
  tipo: gasto|ingreso|pago|traslado|disposicion|ahorro,
  cat, cta, cta2, via, inv, comp, ext, src, ed, nota, link }
```
- `d` fecha del hecho · `ts` cuándo se registró
- `cta` origen real · `cta2` destino (pagos y traslados)
- `via` = yape · plin · fisica · efectivo · transferencia
- `inv:1` invitación · `comp` por cobrar a terceros · `ext:1` ingreso extraordinario
- `src` = manual · importado · sugerido
- `ed:1` corregido a mano · `link` enlaza el Plin con el consumo ya anotado

### `af_fijo` — recurrentes
```
{ id, n, c, cur, cat, dia, cta, estado:activo|revision|cancelado,
  desde, hasta, comp }
```
Muestra **costo anual**. `estado` permite marcar para revisión sin borrar
historia.

### `af_cuota` — deuda en cuotas
```
{ id, n, cTotal, nCuotas, pagadas, cMes, cta, desde, hasta, dia, tea, fCompra }
```
Alimenta los fijos del mes. **No entra en la métrica de arrastre**, y como el
saldo de `cta` sí las incluye, el arrastre las resta con `cuotasPendC(cta)`.
`hasta` existe porque la fecha de término es la mitad del argumento para
separarla del revolvente: se muestra en la fila (*"hasta julio 2027"*).

Hoy: `q01` Mercadopago · 999.00 · 12 × 83.25 · TEA 0 · Amex · 08/2026–07/2027.

### `af_junta`
```
{ id, n, cMes, numeros, miTurno, pagadas, cRecibir, fEstimada, riesgo }
```
Aparece en portada como *"7 de 12 · recibes S/ 12,000 en diciembre"*. Ni plata
disponible ni gasto perdido.

### `af_deuda` — deudas con personas
```
{ id, n, c, sentido:debo|meDeben, motivo, desde, estado, movPago }
```
Existe porque los S/ 2,500 que se debían a la madre eran una obligación real e
**invisible para los estados de cuenta**. Sin esto, la app reporta una situación
mejor que la real. Distinto de `comp` en `af_mov`, que es un reembolso puntual
por un consumo compartido.

### `af_evento` — gastos con fecha conocida
```
{ id, n, c, fecha, cat, estado:pendiente|hecho }
```
Cumpleaños, regalos, viajes. Se restan de la bolsa antes de repartir.
**Un viaje tiene sobre propio**, no es un mes discrecional inflado: planeado con
S/ 1,500 no rompe nada; sin sobre se come la gratificación entera.

### `af_efectivo` — saldo pendiente de asignar
```
{ movId, cSacado, cAsignado, cPendiente, fecha }
```
Deriva de las disposiciones. **Es el corazón del modelo**, porque ahí vive el
83% del gasto.

### `af_mes` — cierre congelado
```
{ "2026-08": { liquido, fijos, cuotas, libre, gastado, inv, deudaFin,
               ruleteo:bool, cerrado:true } }
```

### Otros
`af_ai` (análisis) · `af_diary` (propuestas aplicadas/rechazadas) ·
`af_key` (API key — **solo local, nunca a Firestore ni al repo**)

---

## 9. Barandas en código

> Viven en la función que escribe el dato, **no en el prompt**. Una regla escrita
> en el prompt es un pedido, no un candado. Lección heredada de AscentPeak.

1. **Mes cerrado inmutable.** Ningún cambio de plan reescribe un `af_mes` con
   `cerrado:true`.
2. **La IA no baja el piso de fijos.** No puede proponer recortar junta, casa,
   cochera ni seguro de mamá.
3. **La IA no toca el vóley.** Hábito bueno, se protege como el gym en AscentPeak.
4. **Cambio máximo del límite discrecional: ±20% por mes.** Un salto mayor se
   recorta al tope y se anota el valor original en `af_diary` (campo `cap`).
5. **Detección de ruleteo automática.** Disposición + pago a la misma `cta` en
   ≤3 días → marca el mes como no cerrado. No se puede desmarcar a mano.
6. **Sin consejo de optimización de tarjetas mientras `deudaRevolvente > 0`.**
6c. **La línea disponible nunca se muestra como número grande ni como "tienes".**
   Se muestra como porcentaje de uso. Un saldo disponible de S/ 24,168 en
   pantalla es una invitación, no una información.
6b. **Ningún ingreso `ext:1` entra al saldo disponible sin reparto asignado.**
   Al detectarlo, la app pregunta cómo se parte; la porción de deuda se abona el
   mismo día. La plata sin destino se la lleva el evento más cercano.
7. **La disposición nunca cuenta como gasto**, y el gasto en efectivo nunca puede
   exceder el saldo pendiente registrado.
8. **El arrastre resta siempre las cuotas pendientes de esa misma tarjeta.**
   Vive en `deudaRevolvente()`, no en la carga de datos: si mañana pasa otra
   compra a cuotas, la resta se ajusta sola y no hay que acordarse de nada.
   Cuando el saldo del banco y el arrastre difieren, la fila lo dice en voz
   alta (*"incluye S/ 999.00 en cuotas · fuera del arrastre"*): dos números
   distintos en pantalla sin explicación es peor que un número malo.

---

## 10. Roadmap

### v1 — lo básico y factible · **hecho**
1. Registro en tres toques con cuenta y vía prellenadas
2. Fijos cargados una vez, se descuentan solos, con costo anual visible
3. Eventos con fecha (cumpleaños, regalos)
4. **Un número grande**: libre del mes y findes restantes
5. Saldo de efectivo pendiente de asignar
6. Cierre de mes: cerró solo o hubo ruleteo
7. Saldo de las tres tarjetas, la cuota y la junta

Nada más. Sin gráficos, sin proyecciones, sin IA.

### v2
- ~~Firebase (mismo patrón que AscentPeak: Auth Google + Firestore)~~ **hecho**
- Importar estados de cuenta (`src:"importado"`) y reconciliar contra lo manual
- Reconciliación de Plin: *"PLIN.TANIA 500 el viernes 31, ¿qué fue?"*
- Cobro a terceros (`comp`): cuánto le deben

### v3 — IA
Entra **con dos o tres meses de datos reales**, no antes. Sin datos no tiene qué
leer, y sería construir "por si acaso". Propone como tarjetas con
✓ Aplicar / ✗ Rechazar, igual que AscentPeak, y todo queda en `af_diary`.

### Ingresos extraordinarios de fin de año (`ext:1`)

Estimaciones sobre S/ 4,500 brutos — **verificar contra boleta, no son datos
confirmados**:

| Concepto | Fecha tope | Estimado |
|---|---|---|
| CTS (semestre may–oct) | 15 nov 2026 | ~S/ 2,625 |
| Gratificación de diciembre | 15 dic 2026 | ~S/ 4,905 brutos (sueldo + 9% bonificación EsSalud), menos renta de 5ta |
| **Juntos** | | **~S/ 7,200–7,500** |

Es prácticamente la deuda completa. Con eso, la fecha de salida se adelanta a
**diciembre 2026** incluso gastando S/ 600 al mes.

**Fecha límite real**: la Ley 32322 permite retirar el 100% de la CTS solo
**hasta el 31 de diciembre de 2026**. Desde enero 2027 vuelve el régimen normal
(solo el excedente de cuatro remuneraciones). Si la CTS se va a usar, se decide
antes de esa fecha.

**Se decide en frío, no el día que cae.** Sin decisión previa, tapa el hueco y en
marzo se está igual. La app guarda la decisión en `af_cfg` y la muestra cuando
detecta el ingreso.

### Qué pasó con la gratificación de julio 2026 (~S/ 4,900)

- **S/ 2,500** → saldar una deuda con su madre. **No era gasto: era una deuda
  invisible para las tarjetas.** La deuda total de julio era ~S/ 10,000; hoy es
  7,551. Bajó.
- El resto → gastos varios y amortización, con un viaje de por medio donde se
  desbordó.

**La lección**: el ingreso llegó **sin destino asignado**. La parte que tenía
dueño se fue a su dueño; la parte suelta se la llevó el evento más cercano.
Esto se va a repetir el 15/11 (CTS) y el 15/12 (gratificación) si no hay reparto
decidido de antemano.

### Junta (diciembre 2026)
Los ~S/ 12,000 **no van a la deuda**: tienen destino propio, decidido por el
usuario. El modelo no los ofrece como fuente de abono en ningún cálculo.

---

## 11. Lecciones aprendidas

- **Una métrica que no se mueve no enseña nada.** Tasa de ahorro habría marcado
  cero durante meses. El ratio de arrastre empieza en 1.71 y se mueve solo.
- **Modelar el comportamiento real, no el ideal.** El ruleteo, las invitaciones y
  las disposiciones no son casos borde: son la mayor parte del dinero. Se
  modelan explícitamente o la app mide un mes que no existe.
- **Mirar de dónde sale el número antes de contarlo.** El estado de cuenta
  mostraba S/ 1,823 de gasto mensual. El real pasa de S/ 10,000. Todo lo demás
  estaba en efectivo y Plin.
- **Un número correcto en dos lugares se cuenta dos veces.** Los S/ 999 estaban
  en `af_cuota` y también dentro del saldo de la Amex. El arrastre marcaba 1.98
  en vez de 1.71 y la fecha de salida se atrasaba 20 días. Antes de restar o
  sumar un saldo, preguntar qué incluye — es la misma lección de mirar de dónde
  sale el número, aplicada al revés.
- **Sin interés no significa sin costo.** El ruleteo no cuesta soles: cuesta la
  única señal de que el mes no cerró.
- **Un límite inventado se revienta la primera semana.** Los números de esta app
  salen de tres meses de movimientos reales, no de estimaciones.
- **Un candado que estorba se termina esquivando.** La casilla de "emergencia"
  de `gastos` era un botón de escape sin fricción y sin registro.
- **Nada se construye "por si acaso".** La IA, el multiusuario y los gráficos
  esperan. El diseño queda escrito —que es la parte cara— y se construye el día
  que haga falta.
- **La conversación se comprime.** Por eso existe este archivo.
