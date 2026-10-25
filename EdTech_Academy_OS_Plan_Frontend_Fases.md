# EdTech Academy OS — Plan de desarrollo frontend por fases

> **Alcance:** Fase 1 del PDD/SDD de EdTech Academy OS, adaptada a un **prototipo frontend web desarrollado con Lovable**.  
> **Modo de trabajo:** 100 % local durante el desarrollo: `localhost`, datos de prueba, almacenamiento del navegador y sin backend ni base de datos remota.  
> **Gestor de paquetes obligatorio:** **pnpm** en todo momento.  
> **Estado:** plan de implementación, no funcionalidades ya construidas.

---

## 1. Instrucción principal para Lovable o cualquier agente de desarrollo

Construye el frontend de **EdTech Academy OS** de manera incremental, **una fase a la vez**. Antes de programar una fase, revisa este archivo, los requisitos de la fase y el estado actual del proyecto. **No avances a la fase siguiente** hasta completar los criterios de aceptación de la actual.

### Reglas innegociables

1. Implementar **solo frontend**. No crear API, servidor Fastify, PostgreSQL, Drizzle del servidor, autenticación real ni endpoints ficticios que se presenten como productivos.
2. **Todo debe funcionar localmente**, sin depender de servicios cloud para autenticación, datos o almacenamiento: no Supabase, Firebase, bases de datos alojadas, ni despliegues durante estas fases.
3. **Usar siempre `pnpm`** para instalar, ejecutar scripts, pruebas y compilaciones. No utilizar `npm`, `npx`, `yarn` ni `bun`.
4. Construir un solo prototipo **web React** con tres experiencias por rol: estudiante, docente y administrador. La experiencia de estudiante se diseña **para tablet Android horizontal**.
5. Usar datos ficticios relacionados entre sí; todas las operaciones de prueba deben reflejarse en las vistas correspondientes.
6. Mantener los datos persistentes en el navegador cuando proceda (preferentemente **IndexedDB** para archivos y datos offline; almacenamiento local para preferencias no sensibles). No simular almacenamiento remoto.
7. Los permisos en el frontend son **solo demostrativos**, nunca una medida de seguridad real. Dejar claro qué necesitará validación por una futura API.
8. No colocar respuestas correctas visibles durante la evaluación del estudiante. **Advertencia técnica:** en un prototipo 100 % cliente no se puede garantizar el secreto de respuestas si la clave de calificación vive en el bundle; eso deberá resolverse en el backend futuro.
9. No añadir funciones de Fase 2+ (videollamadas, monitoreo en vivo, MDM/kiosco, IA, chats, exportaciones académicas, bancos de preguntas o gamificación).
10. Usar TypeScript estricto, componentes reutilizables, validación de formularios y estados de carga, vacío, error y desconexión.
11. Documentar qué está **simulado** y qué funciona **realmente en el navegador**.
12. Priorizar calidad y coherencia sobre añadir pantallas sin comportamiento.

### Aclaración sobre el documento fuente

El PDD/SDD original prescribe **Next.js** para el panel web y **Expo + React Native** para la aplicación Android. **Este plan es una adaptación deliberada para Lovable:** se crea primero un prototipo web unificado con **React + Vite**, incluido el diseño horizontal de tablet. **No es una APK ni sustituye la futura aplicación nativa.** El diseño, tipos y flujos deben facilitar posteriormente la implementación con Next.js y Expo.

---

## 2. Tecnologías y convenciones

| Área | Herramienta |
|---|---|
| Lenguaje | TypeScript en modo `strict` |
| Aplicación web local | React + Vite |
| Navegación | React Router |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Iconos | lucide-react |
| Estado compartido | Zustand (si aporta valor) |
| Formularios | React Hook Form + Zod |
| Gráficos | Recharts |
| Persistencia de demo | IndexedDB y, solo para datos no sensibles, `localStorage` |
| Pruebas unitarias | Vitest + Testing Library |
| Pruebas E2E web | Playwright |
| Gestor de paquetes | **pnpm, sin excepciones** |

**Reglas de comandos:**

```bash
pnpm install
pnpm dev
pnpm add <dependencia>
pnpm add -D <dependencia-de-desarrollo>
pnpm exec <comando>
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

> Los scripts `lint`, `typecheck` y `test` deben configurarse en `package.json` durante la preparación. El marcador `<dependencia>` es ilustrativo, no un comando literal para ejecutar.

**Desarrollo local:** iniciar el proyecto desde la terminal de la máquina y abrir la URL que indique Vite (habitualmente `http://localhost:5173`). Todos los datos de uso serán de prueba. Los vídeos de YouTube son la **única dependencia externa prevista para reproducir contenido**, y requieren conexión.

### Estructura de carpetas propuesta

```text
src/
  app/                # Rutas, proveedores, layouts y navegación
  components/
    ui/               # shadcn/ui
    shared/           # Tablas, diálogos, estados, indicadores, etc.
  features/
    auth/
    admin/
    students/
    teachers/
    courses/
    modules/
    materials/
    exams/
    attempts/
    results/
    progress/
    offline/
  mock/
    seed/             # Datos de demostración consistentes
    services/         # Interfaces asíncronas simuladas
  storage/            # IndexedDB, migración y repositorios locales
  types/              # Tipos y contratos de datos
  lib/                # Utilidades, validaciones, fechas
  styles/             # Tokens y estilos globales
public/
  demo/               # PDF, imágenes y recursos de prueba locales
```

Mantener servicios con interfaces desacopladas (`AuthService`, `CourseService`, `ExamService`, etc.) para reemplazar sus implementaciones locales por llamadas REST cuando exista backend.

---

## 3. Alcance funcional resumido

### Estudiante — tablet horizontal

- Ingreso mediante código alfanumérico o QR de demostración.
- Sesión de demostración y cierre de sesión.
- Mis cursos, módulos y contenidos.
- Visualización de PDF, imágenes y enlaces de YouTube.
- Material descargado/localmente disponible, con límites explícitos.
- Exámenes con preguntas de opción múltiple, verdadero/falso y respuesta corta.
- Temporizador, navegación por preguntas, guardado local y confirmación de entrega.
- Estado de conexión, cola de envíos simulados y progreso personal.

### Docente — navegador de escritorio

- Ingreso por correo y contraseña **simulados**.
- Dashboard de actividad y cursos propios.
- Gestión de cursos, módulos, materiales e inscripciones.
- Editor, vista previa y publicación de exámenes.
- Resultados, revisión manual de respuestas cortas y progreso por alumno/curso.

### Administrador — navegador de escritorio

- Ingreso por correo y contraseña **simulados**.
- Alta, edición y desactivación de alumnos.
- Generación y vista de códigos/QR de acceso para demo; impresión de tarjeta.
- Gestión básica de docentes/usuarios de demostración.
- Registro local de auditoría de acciones.

**Privacidad:** evitar fotografías de estudiantes, capturas o cualquier recolección de información real de menores.

---

# 4. Fases de desarrollo

## Fase 0 — Preparación y contratos de datos

**Objetivo:** arrancar el frontend con pnpm y establecer una base técnica ordenada.

### Tareas

- [ ] Inicializar proyecto React + Vite + TypeScript, compatible con el flujo de Lovable.
- [ ] Confirmar que `pnpm` es el único gestor de paquetes; mantener `pnpm-lock.yaml`.
- [ ] Configurar TypeScript estricto, ESLint, Prettier y scripts `dev`, `build`, `lint`, `typecheck` y `test`.
- [ ] Instalar React Router, Tailwind, shadcn/ui, Lucide, Zod, React Hook Form y dependencias de estado/gráficos cuando hagan falta.
- [ ] Crear estructura modular de carpetas.
- [ ] Definir modelos TypeScript: usuario, perfil de estudiante, curso, módulo, matrícula, material, archivo, examen, pregunta, opción, intento, respuesta, progreso y auditoría.
- [ ] Crear interfaces de repositorios/servicios locales, sin HTTP real.
- [ ] Preparar datos ficticios iniciales consistentes: 1 administrador, 2 docentes, 6 alumnos, 3 cursos, módulos, materiales, exámenes y resultados.
- [ ] Implementar restablecimiento controlado de datos demo para pruebas.
- [ ] Verificar inicio con `pnpm dev` y compilación con `pnpm build`.

### Entregable

Aplicación local funcionando, estructura modular creada y datos de demostración reutilizables.

### Criterios de aceptación

- [ ] `pnpm dev`, `pnpm lint`, `pnpm typecheck` y `pnpm build` ejecutan sin fallos.
- [ ] No hay dependencias de API ni servicios remotos para funcionar.
- [ ] Los modelos y semillas son reutilizables por todos los roles.

---

## Fase 1 — Sistema de diseño y layouts

**Objetivo:** lograr una identidad visual consistente y preparar pantallas reutilizables.

### Tareas

- [ ] Crear tokens de color, tipografía, espaciado, radio de bordes y sombras.
- [ ] Paleta sugerida: `#0D9488` (principal), `#0F766E` (principal oscuro), `#12333B` (texto destacado), `#F8FAFC` (fondo).
- [ ] Definir tipografía moderna (p. ej., Inter) e iconografía Lucide.
- [ ] Construir componentes base: botones, inputs, selectores, tabs, tarjetas, tablas, breadcrumbs, diálogos, toasts, badges y skeletons.
- [ ] Crear layout del panel de escritorio: sidebar, header, menú de perfil, contenido y navegación.
- [ ] Crear layout independiente del estudiante, optimizado para tablet **en horizontal**.
- [ ] Garantizar targets táctiles de al menos 48 dp equivalentes y tipografía habitual de al menos 16 sp equivalentes en tablet.
- [ ] Diseñar estados base: cargando, vacío, error y sin conexión.
- [ ] Implementar un estilo profesional, claro y de baja carga visual; no generar una landing page comercial.

### Entregable

Sistema de diseño y dos layouts navegables con componentes de ejemplo.

### Criterios de aceptación

- [ ] Panel usable en escritorio y adaptado a tamaños menores.
- [ ] Interfaz del estudiante usable en viewport horizontal tipo 1280 × 800.
- [ ] Contraste, foco, espacios y áreas táctiles comprobados.

---

## Fase 2 — Login simulado, roles y navegación

**Objetivo:** entrar a cada experiencia mediante flujos de autenticación locales.

### Tareas

- [ ] Crear login de docentes/administradores (correo y contraseña de prueba).
- [ ] Crear login de alumnos por código alfanumérico.
- [ ] Diseñar pantalla de QR y habilitar un **escáner de demostración**; usar cámara real solo si el navegador lo permite y conservar alternativa manual.
- [ ] Vincular los códigos QR demo con los códigos alfanuméricos locales.
- [ ] Implementar estado de sesión de prueba y cierre de sesión.
- [ ] Proteger **visualmente** las rutas por rol y redirigir a la experiencia correspondiente.
- [ ] Agregar usuario y rol activos al encabezado.
- [ ] Incluir estados de credenciales incorrectas, campos vacíos y errores de lectura QR.
- [ ] Facilitar el cambio entre cuentas demo solo mediante cerrar sesión e ingresar con otra cuenta.

### Rutas sugeridas

```text
/login
/alumno/ingresar
/alumno/qr
/docente/inicio
/admin/inicio
```

### Entregable

Tres roles con acceso de demostración, rutas separadas y navegación funcional.

### Criterios de aceptación

- [ ] Un alumno puede ingresar con un código demo válido.
- [ ] Docente y administrador ingresan con sus cuentas demo.
- [ ] Cada rol ve solo los menús correspondientes.
- [ ] Tras cerrar sesión, se vuelve al login adecuado.

---

## Fase 3 — Administración de alumnos, docentes y códigos QR

**Objetivo:** construir primero los datos de personas que luego utilizarán cursos y exámenes.

### Tareas

- [ ] Dashboard administrativo básico con contadores derivados de los datos demo.
- [ ] Tabla de alumnos con búsqueda y filtros por grado, sección y estado.
- [ ] Formularios para crear, editar, desactivar y reactivar alumnos.
- [ ] Generación y renovación de códigos alfanuméricos de prueba.
- [ ] Generación y vista imprimible de QR/tarjeta de acceso.
- [ ] Tabla de docentes con creación, edición y activación/desactivación simuladas.
- [ ] Tabla de usuarios con roles y estado.
- [ ] Registro local de acciones relevantes en auditoría.
- [ ] Confirmación para operaciones destructivas y estados vacíos.

### Rutas sugeridas

```text
/admin/inicio
/admin/alumnos
/admin/alumnos/:id
/admin/docentes
/admin/usuarios
/admin/auditoria
```

### Entregable

Panel administrativo navegable con formularios, tablas y QR demo imprimible.

### Criterios de aceptación

- [ ] Crear o editar un estudiante actualiza inmediatamente las vistas.
- [ ] Un QR generado corresponde a un código local válido de demostración.
- [ ] Desactivar un estudiante impide su acceso simulado.
- [ ] Las acciones quedan visibles en auditoría local.

---

## Fase 4 — Cursos, módulos e inscripciones del docente

**Objetivo:** permitir al docente organizar la estructura académica.

### Tareas

- [ ] Dashboard del docente con cursos propios y métricas derivadas.
- [ ] Pantalla "Mis cursos" con búsqueda, filtros y estados borrador/publicado.
- [ ] Formulario para crear y editar cursos (título y descripción).
- [ ] Pantalla de detalle del curso: resumen, módulos, estudiantes, exámenes y progreso.
- [ ] Crear, editar, eliminar y **reordenar** módulos.
- [ ] Inscribir alumnos existentes mediante selección múltiple.
- [ ] Evitar matrículas duplicadas y permitir retirar una inscripción con confirmación.
- [ ] Limitar visualmente la gestión a los cursos del docente activo.
- [ ] Reflejar publicaciones e inscripciones en la experiencia del alumno.

### Rutas sugeridas

```text
/docente/inicio
/docente/cursos
/docente/cursos/nuevo
/docente/cursos/:id
/docente/cursos/:id/editar
/docente/cursos/:id/estudiantes
```

### Entregable

Flujo completo: crear curso → crear módulos → inscribir alumnos → publicar.

### Criterios de aceptación

- [ ] Los módulos conservan su orden.
- [ ] El alumno solo ve cursos publicados y en los que está inscrito.
- [ ] Los indicadores del dashboard coinciden con los registros reales de demo.

---

## Fase 5 — Materiales educativos y lectores

**Objetivo:** publicar y consumir contenido de los tres tipos permitidos.

### Tareas para docente

- [ ] Añadir material a un módulo: **PDF**, **imagen** o **enlace de YouTube**.
- [ ] Formulario con título, tipo, validación y orden del material.
- [ ] Selección drag-and-drop y previsualización local de PDF o imagen.
- [ ] Validación y vista previa de URL de YouTube.
- [ ] Editar, eliminar y reordenar materiales.
- [ ] Persistir archivos demo seleccionados en IndexedDB si el navegador lo permite; gestionar errores y cuota.

### Tareas para alumno

- [ ] Pantalla "Mis cursos" con tarjetas y progreso.
- [ ] Detalle de curso con módulos y recursos ordenados.
- [ ] Visor integrado de PDF con controles disponibles de navegación/zoom.
- [ ] Visor de imágenes con ampliación y retorno al curso.
- [ ] Reproductor embebido de YouTube para enlaces compatibles.
- [ ] Registrar eventos locales de recurso visto/completado.
- [ ] Mostrar estado de material local/disponible o pendiente.
- [ ] Indicar que **los vídeos de YouTube requieren conexión** y no se descargan como parte de esta fase.

### Rutas sugeridas

```text
/docente/cursos/:id/materiales
/alumno/cursos
/alumno/cursos/:id
/alumno/material/:id
```

### Entregable

El docente publica recursos y el alumno inscrito puede abrirlos desde su curso.

### Criterios de aceptación

- [ ] PDF e imágenes demo disponibles localmente se abren sin backend.
- [ ] El material añadido aparece bajo el módulo correcto.
- [ ] Un enlace de YouTube inválido muestra error comprensible.
- [ ] Ningún recurso se marca como descargado si no está efectivamente disponible localmente.

---

## Fase 6 — Editor, vista previa y publicación de exámenes

**Objetivo:** cubrir por completo la creación de evaluaciones desde el panel docente.

### Tareas

- [ ] Listado de exámenes con curso, fecha, duración, puntaje y estado.
- [ ] Formulario de examen: título, curso, duración, apertura y cierre.
- [ ] Editor de preguntas de **opción múltiple con respuesta única**, **verdadero/falso** y **respuesta corta**.
- [ ] Enunciados, puntajes y orden editable de preguntas.
- [ ] Alta, edición y eliminación de opciones donde corresponda.
- [ ] Definir respuesta correcta solo para las preguntas cerradas.
- [ ] Calcular puntaje máximo del examen.
- [ ] Validar preguntas incompletas, fechas incoherentes y duración inválida.
- [ ] Guardar borrador, editar, previsualizar, publicar o retirar publicación.
- [ ] Mantener versión de examen en el modelo para futuras reglas de edición/sincronización.
- [ ] La vista previa debe mostrar la experiencia del alumno sin crear un intento real.

### Rutas sugeridas

```text
/docente/examenes
/docente/examenes/nuevo
/docente/examenes/:id/editar
/docente/examenes/:id/vista-previa
```

### Entregable

Editor funcional con las tres clases de pregunta y publicación simulada.

### Criterios de aceptación

- [ ] Un docente puede crear y publicar un examen válido.
- [ ] Los exámenes borrador no aparecen disponibles al alumno.
- [ ] La vista previa respeta la estructura final de preguntas.
- [ ] No se añaden tipos de pregunta previstos para fases futuras.

---

## Fase 7 — Examen del alumno, temporizador y guardado local

**Objetivo:** completar el flujo de rendición de exámenes en una tablet horizontal.

### Tareas

- [ ] Listado de exámenes asociados a cursos inscritos.
- [ ] Etiquetas de estado: próximo, disponible, terminado, pendiente de sincronización, pendiente de revisión, calificado.
- [ ] Preparación local del paquete de preguntas **sin mostrar respuestas correctas**.
- [ ] Pantalla de evaluación con título, progreso, temporizador y estado de guardado.
- [ ] Navegación anterior/siguiente y salto entre preguntas.
- [ ] Diferenciar preguntas respondidas y pendientes.
- [ ] Controles táctiles grandes para las tres clases de preguntas.
- [ ] Guardado **automático por respuesta** en IndexedDB; UUID local por intento.
- [ ] Preservar hora de inicio para que el temporizador no se reinicie al navegar o recargar.
- [ ] Advertencia de tiempo próximo a agotarse.
- [ ] Diálogo final con total de preguntas respondidas y sin responder.
- [ ] Cierre local del intento tras confirmar envío o agotarse el tiempo.
- [ ] Bloquear modificaciones sobre intentos ya enviados.
- [ ] Pantalla de confirmación con estado pendiente/sincronizado simulado.

### Rutas sugeridas

```text
/alumno/examenes
/alumno/examenes/:id/instrucciones
/alumno/examenes/:id/rendir
/alumno/examenes/:id/confirmacion
```

### Entregable

Alumno completa, guarda y envía localmente un examen completo.

### Criterios de aceptación

- [ ] Las respuestas persisten al cambiar de pregunta y recargar.
- [ ] El temporizador conserva el tiempo correcto.
- [ ] Un intento enviado ya no es editable.
- [ ] Ninguna acción depende de un servidor real.

---

## Fase 8 — Offline local y cola de sincronización simulada

**Objetivo:** demostrar los estados offline previstos en el documento sin fingir que existe una API.

### Tareas

- [ ] Implementar indicador visible de conectividad del navegador.
- [ ] Añadir un control **solo para desarrollo**: "Simular sin conexión".
- [ ] Mantener cursos, paquetes de examen y recursos ya preparados en almacenamiento local cuando sea viable.
- [ ] Guardar cada respuesta inmediatamente en IndexedDB.
- [ ] Agregar intentos finalizados a una cola local `outbox` cuando estén pendientes.
- [ ] Mostrar estados: guardado en este dispositivo, pendiente, procesando demo, completado demo y error.
- [ ] Al restablecer modo demo online, procesar la cola **localmente**, sin efectuar `POST /sync` real.
- [ ] Evitar intentos duplicados mediante UUID y estados de procesamiento.
- [ ] Diferenciar "sincronizado en la simulación" de "sincronizado con un servidor".
- [ ] Evaluar uso de service worker/PWA para permitir abrir la aplicación web ya cargada sin red; si se implementa, probar realmente su caché. **IndexedDB por sí solo no garantiza que la app arranque estando sin conexión**.
- [ ] Señalar que YouTube no funcionará offline y que la persistencia está sujeta a cuota/limpieza del navegador.
- [ ] Advertir antes de cerrar sesión si existen entregas pendientes.

### Entregable

Demo de examen completado offline, guardado local y procesamiento posterior **simulado**.

### Criterios de aceptación

- [ ] Se puede continuar un examen preparado tras activar el modo desconectado.
- [ ] No se pierden respuestas al navegar o recargar dentro de las condiciones verificadas.
- [ ] La cola local no duplica intentos al reintentar su procesamiento.
- [ ] Los textos de interfaz no afirman que exista sincronización remota.

---

## Fase 9 — Resultados, calificación manual y progreso

**Objetivo:** cerrar el circuito docente → alumno → evaluación → resultados.

### Tareas para docente

- [ ] Resultados por examen y estudiante.
- [ ] Tabla con fecha de envío, estado, puntos obtenidos y máximo.
- [ ] Calificación local automática de **preguntas cerradas** en la simulación.
- [ ] Cola de respuestas cortas pendientes de revisión.
- [ ] Formulario de nota manual con valor entre `0` y puntos máximos.
- [ ] Actualización de resultados al calificar todas las respuestas pendientes.
- [ ] Dashboard de progreso por curso y alumno, con Recharts.
- [ ] Búsqueda, filtros y estados sin resultados.

### Tareas para alumno

- [ ] Pantalla "Mi progreso" con lista de cursos.
- [ ] Materiales vistos/completados, exámenes rendidos y resultados disponibles.
- [ ] Barras de progreso derivadas de registros locales, con fórmula identificada como **demo**.
- [ ] Indicación clara de resultados aún pendientes de revisión.
- [ ] Ajustes básicos, información del alumno y cierre de sesión.

### Rutas sugeridas

```text
/docente/resultados
/docente/examenes/:id/resultados
/docente/intentos/:id/revision
/docente/progreso
/docente/progreso/cursos/:id
/alumno/progreso
/alumno/ajustes
```

### Entregable

Calificaciones y progreso conectados a los datos e interacciones de prueba.

### Criterios de aceptación

- [ ] Las respuestas cortas nunca reciben puntuación automática por texto.
- [ ] El puntaje mostrado coincide con las respuestas evaluadas.
- [ ] Los dashboards se actualizan al completar o revisar una evaluación.
- [ ] No se impone una escala 0–20 o nota aprobatoria: el PDD/SDD solo define puntajes de preguntas y exámenes.

---

## Fase 10 — QA, pulido visual y cierre del frontend local

**Objetivo:** entregar una demo estable, navegable y comprobable de Fase 1.

### Tareas

- [ ] Revisar rutas, botones, formularios, filtros, confirmaciones y persistencia.
- [ ] Probar en escritorio y en viewport tablet horizontal 1280 × 800 (y tamaños cercanos).
- [ ] Comprobar validaciones, estados vacíos, errores y desconexión.
- [ ] Verificar foco visible, teclado, etiquetas, contraste y botones táctiles.
- [ ] Crear pruebas unitarias de lógica de exámenes, temporizador, calificaciones y repositorios locales.
- [ ] Crear pruebas E2E web del flujo docente → publicación → alumno → evaluación → resultados.
- [ ] Probar al menos 10 ejecuciones del flujo offline simulado, verificando integridad de respuestas.
- [ ] Verificar que no haya llamadas a Supabase/Firebase/backend ni datos reales de estudiantes.
- [ ] Ejecutar `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`.
- [ ] Documentar cuentas demo, rutas, datos semilla, limitaciones del prototipo y reinicio de la demo.
- [ ] Entregar una lista final de funcionalidades completas, parciales y no implementadas.

### Entregable

Frontend local Fase 1 completo, con demo funcional y documentación mínima de uso.

### Criterios de aceptación

- [ ] Un administrador crea estudiante y código/QR de demostración.
- [ ] Un docente crea curso, módulos y materiales e inscribe alumnos.
- [ ] El docente crea y publica examen; el alumno inscrito lo encuentra.
- [ ] El alumno responde, guarda y finaliza un examen.
- [ ] El estado offline simulado y la cola local funcionan dentro de sus límites conocidos.
- [ ] El docente visualiza intentos, revisa respuestas cortas y consulta progreso.
- [ ] El alumno consulta sus resultados y progreso.
- [ ] Todos los comandos de instalación y ejecución utilizan pnpm.

---

## 5. Orden de trabajo y dependencias

```text
Fase 0  Preparación, modelos y mock data
   ↓
Fase 1  Sistema de diseño y layouts
   ↓
Fase 2  Autenticación demo y roles
   ↓
Fase 3  Administración y códigos QR
   ↓
Fase 4  Cursos, módulos e inscripciones
   ↓
Fase 5  Materiales y lectores
   ↓
Fase 6  Editor y publicación de exámenes
   ↓
Fase 7  Evaluación del alumno
   ↓
Fase 8  Offline y sincronización simulada
   ↓
Fase 9  Resultados y progreso
   ↓
Fase 10 QA y entrega local
```

Las fases pueden dividirse en tareas más pequeñas, pero no omitir sus criterios de aceptación.

---

## 6. Contratos de datos mínimos

Definir tipos compatibles con las entidades identificadas en el SDD:

- `User`: identificador, rol (`student | teacher | admin`), nombre, correo opcional y estado.
- `StudentProfile`: usuario, código de acceso demo, grado y sección.
- `Course`: título, descripción, docente, publicado.
- `CourseModule`: curso, título y posición.
- `Enrollment`: curso, estudiante, fecha.
- `ContentItem`: módulo, tipo (`pdf | image | youtube`), título, referencia de archivo o ID YouTube y posición.
- `Exam`: curso, título, duración, fechas, publicación, versión.
- `Question`: examen, tipo (`mcq | tf | short`), enunciado, puntos y posición.
- `QuestionOption`: pregunta, texto, corrección y posición.
- `Attempt`: examen, estudiante, dispositivo demo, inicio, envío, estado y puntaje.
- `Answer`: intento, pregunta, valor, marca de actualización y puntaje otorgado.
- `ProgressEvent`: alumno, contenido, evento (`viewed | completed`) y momento.
- `AuditLog`: actor, acción, entidad, identificador y fecha.

> Se trata de **contratos de frontend** y semillas para la demo. No crear tablas SQL, migraciones de servidor ni ORM del backend.

### Reglas de coherencia

- Todos los IDs de la demo son estables; los nuevos registros reciben UUID.
- Un alumno solo ve cursos publicados en los que está inscrito.
- Un docente solo administra sus cursos e inscripciones.
- Las preguntas tienen orden y puntaje definido.
- Los intentos admiten los estados `in_progress`, `submitted` y `graded` (acompañados del estado local de sincronización cuando corresponda).
- Los exámenes publicados solo pueden iniciarse dentro de su ventana temporal configurada.
- Las respuestas de un intento enviado quedan bloqueadas.
- Las notas de respuesta corta se registran manualmente.
- Los gráficos se calculan a partir de los registros, nunca de cifras independientes inventadas.

---

## 7. Protocolo de ejecución por fase para Lovable

Cuando se solicite implementar una fase, el agente debe:

1. Leer las instrucciones globales y la fase solicitada.
2. Revisar el código y comprobar qué existe ya.
3. Identificar los componentes, rutas, stores, datos demo y validaciones necesarios.
4. Implementar únicamente esa fase y las dependencias indispensables.
5. Ejecutar las verificaciones disponibles con `pnpm`.
6. Revisar visualmente las pantallas afectadas en escritorio/tablet según corresponda.
7. Entregar al finalizar un resumen concreto:
   - Cambios realizados.
   - Rutas y componentes creados.
   - Interacciones que funcionan.
   - Comandos ejecutados y resultado.
   - Limitaciones o pendientes.
   - Criterios de aceptación cumplidos/no cumplidos.
8. **Detenerse** y esperar la instrucción para continuar con otra fase.

### Prompt breve para iniciar el trabajo con este archivo

> Lee completamente `EdTech_Academy_OS_Plan_Frontend_Fases.md`. Este archivo será el plan maestro del frontend de EdTech Academy OS. Trabajaremos solo en local, con datos de demostración y exclusivamente con `pnpm` (nunca npm, npx, yarn ni bun). Empieza **solo por la Fase 0**. No implementes fases posteriores. Verifica los criterios de aceptación, documenta cualquier limitación y detente cuando termines.

### Prompt breve para continuar

> Continúa con la **Fase N** del archivo `EdTech_Academy_OS_Plan_Frontend_Fases.md`. Respeta todas las reglas globales, conserva lo realizado anteriormente, utiliza solo pnpm, no crees backend y no avances a la siguiente fase. Al terminar, indica qué criterios comprobaste.

---

## 8. Exclusiones permanentes hasta nuevo aviso

No implementar todavía:

- Backend REST/Fastify, PostgreSQL, Drizzle del servidor o Docker.
- Autenticación JWT real, hash de contraseñas ni control de permisos en servidor.
- Sincronización entre dispositivos ni `POST /sync` auténtico.
- Almacenamiento central de archivos o servicios S3.
- Aplicación Android nativa / build APK.
- VPS, hosting o despliegue de producción.
- Videollamadas, vigilancia de alumnos, MDM o kiosco.
- IA, mensajería, gamificación y funciones de futuras fases.

**Nota final:** esta planificación toma los requisitos funcionales de **Fase 1** del PDD/SDD, pero adapta el stack a un prototipo web local ejecutable en Lovable. Las funciones offline, la seguridad, la sincronización y el almacenamiento definitivo deberán comprobarse e implementarse de nuevo en la arquitectura real (app Android + panel + API) cuando el proyecto pase de prototipo a producto.
