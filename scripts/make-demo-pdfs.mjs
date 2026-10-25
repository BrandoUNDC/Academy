import fs from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const out = path.resolve('public/demo')
await fs.mkdir(out, { recursive: true })

async function create(name, subject, title, lead, sections) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([612, 792])
  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const black = rgb(.09, .09, .09), gray = rgb(.47, .47, .47), white = rgb(1, 1, 1)
  page.drawRectangle({ x: 0, y: 746, width: 612, height: 46, color: black })
  page.drawText('ACADEMIA.', { x: 48, y: 761, size: 13, font: bold, color: white })
  page.drawText('GUIA DE APRENDIZAJE / DEMO', { x: 410, y: 762, size: 8, font: regular, color: white })
  page.drawText(subject.toUpperCase(), { x: 48, y: 695, size: 9, font: bold, color: gray })
  page.drawText(title, { x: 48, y: 650, size: 29, font: bold, color: black })
  page.drawText(lead, { x: 48, y: 624, size: 11, font: regular, color: gray })
  let y = 566
  for (const [number, heading, lines] of sections) {
    page.drawCircle({ x: 60, y: y + 4, size: 13, color: black })
    page.drawText(String(number), { x: 57, y, size: 10, font: bold, color: white })
    page.drawText(heading, { x: 88, y, size: 15, font: bold, color: black })
    lines.forEach((line, i) => page.drawText(line, { x: 88, y: y - 23 - i * 18, size: 11, font: regular, color: gray }))
    y -= 124
  }
  page.drawLine({ start: { x: 48, y: 83 }, end: { x: 564, y: 83 }, thickness: 1, color: rgb(.85, .85, .85) })
  page.drawText('Material ficticio para el prototipo local de Academia OS', { x: 48, y: 64, size: 9, font: regular, color: gray })
  page.drawText('01 / 01', { x: 524, y: 64, size: 9, font: regular, color: gray })
  await fs.writeFile(path.join(out, name), await doc.save())
}

await create('fracciones.pdf', 'Matematicas / Modulo 01', 'Guia de fracciones', 'Representar partes de un todo nos ayuda a resolver problemas.', [
  [1, 'Que es una fraccion?', ['Una fraccion representa una o varias partes iguales de un todo.', 'Ejemplo: 1/2 significa una de dos partes iguales.']],
  [2, 'Fracciones equivalentes', ['Dos fracciones son equivalentes si representan la misma cantidad.', 'Ejemplo: 1/2 y 2/4 tienen el mismo valor.']],
  [3, 'Practica', ['Dibuja un circulo y dividelo en cuatro partes iguales.', 'Colorea dos partes. Que fraccion coloreaste?']],
])
await create('lectura.pdf', 'Comunicacion / Modulo 01', 'Guia de lectura', 'Comprender un texto comienza con observar y preguntar.', [
  [1, 'Antes de leer', ['Observa el titulo y piensa de que podria tratar el texto.', 'Recuerda lo que ya sabes sobre el tema.']],
  [2, 'Durante la lectura', ['Identifica las ideas principales de cada parrafo.', 'Si una palabra es nueva, busca pistas en el contexto.']],
  [3, 'Despues de leer', ['Resume el texto con tus propias palabras.', 'Explica que aprendiste y que preguntas te quedan.']],
])
