/**
 * Download Animal Crossing amiibo card images from Nintendo JP official site.
 *
 * Usage: npx tsx scripts/download-images.ts
 *
 * Images are saved to public/images/series-{n}/XXX.png
 */

import { mkdir, access } from 'fs/promises'
import { createWriteStream } from 'fs'
import { join } from 'path'
import https from 'https'

const BASE_URL = 'https://www.nintendo.com/jp/character/mori/_img/item'

const SERIES: { series: number; prefix: string; start: number; end: number }[] = [
  { series: 1, prefix: 'card_1_l', start: 1, end: 100 },
  { series: 2, prefix: 'card_2_l', start: 101, end: 200 },
  { series: 3, prefix: 'card_3_l', start: 201, end: 300 },
  { series: 4, prefix: 'card_4_l', start: 301, end: 400 },
  { series: 5, prefix: 'card_5_l', start: 401, end: 448 },
]

function pad(n: number): string {
  return n.toString().padStart(3, '0')
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        if (response.headers.location) {
          download(response.headers.location, dest).then(resolve, reject)
        } else {
          reject(new Error(`Redirect without location for ${url}`))
        }
        return
      }
      if (response.statusCode !== 200) {
        file.close()
        reject(new Error(`HTTP ${response.statusCode} for ${url}`))
        return
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      file.close()
      reject(err)
    })
  })
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  const projectRoot = join(import.meta.dirname, '..')

  for (const { series, prefix, start, end } of SERIES) {
    const dir = join(projectRoot, 'public', 'images', `series-${series}`)
    await mkdir(dir, { recursive: true })

    console.log(`\nDownloading Series ${series} (${start}-${end})...`)

    for (let i = start; i <= end; i++) {
      const filename = `${pad(i)}.png`
      const dest = join(dir, filename)

      if (await fileExists(dest)) {
        console.log(`  Skipping ${filename} (already exists)`)
        continue
      }

      const url = `${BASE_URL}/${prefix}/${pad(i)}.png`
      try {
        await download(url, dest)
        console.log(`  Downloaded ${filename}`)
      } catch (err) {
        console.error(`  Failed ${filename}: ${err}`)
      }

      // Small delay to be polite to the server
      await new Promise((r) => setTimeout(r, 200))
    }
  }

  console.log('\nDone!')
}

main()
