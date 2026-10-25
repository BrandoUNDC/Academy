import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const context = await browser.newContext({ serviceWorkers: 'allow' })
const page = await context.newPage()
try {
  await page.goto('http://127.0.0.1:4173/login')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await context.setOffline(true)
  await page.reload()
  const title = await page.getByRole('heading', { name: 'Bienvenido de nuevo' }).textContent()
  if (!title) throw new Error('La aplicación no abrió sin red.')
  console.log('Offline PWA: app shell disponible tras instalar el service worker.')
} finally {
  await browser.close()
}
