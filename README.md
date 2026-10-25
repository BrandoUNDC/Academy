# Academia OS — prototipo frontend local

Demo web de la Fase 1 descrita en `EdTech_Academy_OS_Plan_Frontend_Fases.md`. Es un prototipo React + Vite, no una APK ni una plataforma con servidor.

## Iniciar

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:5173`. Para comprobar la versión de producción y su caché offline:

```bash
pnpm build
pnpm preview
```

## Cuentas demo

| Rol | Acceso |
| --- | --- |
| Administrador | `admin@academia.demo` / `demo123` |
| Docente | `lucia@academia.demo` / `demo123` |
| Docente | `diego@academia.demo` / `demo123` |
| Estudiante | Código `ACD-2048` (Camila Rojas) |

Hay otros cinco códigos en el panel administrativo. Son solo datos ficticios. La contraseña demo y los códigos no son mecanismos de seguridad.

## Qué funciona en el navegador

- Acceso por rol y navegación local; administración de estudiantes/docentes, activación y tarjetas QR imprimibles.
- Cursos, módulos, inscripciones, publicación de contenido PDF/imagen/YouTube y archivos seleccionados guardados en IndexedDB.
- Editor de exámenes de opción múltiple, verdadero/falso y respuesta corta; vista previa y publicación.
- Intentos con temporizador, guardado por respuesta en IndexedDB, confirmación de entrega, calificación automática de preguntas cerradas y revisión manual de respuestas cortas.
- Resultados y progreso calculados desde los registros, modo sin conexión simulado y procesamiento **local** de entregas pendientes.
- Archivos de ejemplo y recursos de la app precargados por el service worker de la versión de producción. YouTube requiere conexión.
- Restablecimiento de los datos demo en **Alumno → Ajustes → Restablecer**. El botón de conectividad del encabezado activa o desactiva la simulación de desconexión.

## Límites del prototipo

- Todas las cuentas, permisos, notas y sincronizaciones son demostrativos. No existe API, servidor ni transferencia entre dispositivos. El botón “Procesar demo” solo cambia el estado de la cola local.
- La clave de respuestas cerradas vive en el bundle del cliente. Solo un backend futuro podrá mantenerla secreta y validar los permisos y calificaciones.
- La persistencia depende de la cuota del navegador y puede perderse al borrar sus datos. Los archivos cargados por el docente permanecen solo en ese navegador; no se comparten con otro dispositivo.
- El arranque offline requiere haber abierto antes la **versión de producción** para instalar el service worker. `pnpm dev` no ofrece esa garantía.
- La cámara QR depende de `BarcodeDetector` y de los permisos del navegador. El código manual siempre está disponible.
- Módulos y materiales se reordenan con flechas. Los archivos pueden seleccionarse o arrastrarse al formulario.
- Este prototipo no incluye backend, APK, videollamadas, chat, IA ni exportaciones académicas.

## Despliegue en Vercel

El archivo `vercel.json` reescribe las rutas de React Router a `index.html`. Así `/login`, `/alumno/cursos` y las demás rutas también abren desde una pestaña nueva o incógnito. Vercel debe compilar con `pnpm build` y servir el directorio `dist`.

## Verificar

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Las pruebas unitarias cubren temporizador, calificación local y diez entregas offline independientes. Las pruebas E2E cubren administrador → creación/QR/desactivación y docente → publicación → alumno → entrega → revisión. El porcentaje de progreso demo es `recursos completados / recursos disponibles`.
