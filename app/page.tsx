import styles from './page.module.css'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import OpinionWindowEmbedded from '@/components/OpinionWindowEmbedded'

type Trend = 'up' | 'down' | 'flat'

type Feed = {
  generated_at: string
  pulse: { text: string }[]
  opinion: {
    title: string
    subtitle: string
    cta_label: string
  }
  kpis: {
    name: string
    value: string
    trend: Trend
    note?: string
  }[]
}

async function getHomeFeed(): Promise<Feed> {
  const filePath = path.join(process.cwd(), 'public', 'home-feed.json')
  const raw = await readFile(filePath, 'utf-8')
  return JSON.parse(raw) as Feed
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function trendClass(trend: Trend) {
  if (trend === 'up') return styles.kpiUp
  if (trend === 'down') return styles.kpiDown
  return styles.kpiFlat
}

export default async function HomePage() {
  const feed = await getHomeFeed()

  return (
    <main className={styles.main}>
      {/* Pulso */}
      <details open className={styles.block}>
        <summary className={styles.summary}>Pulso del gremio</summary>
        <ul className={styles.list}>
          {feed.pulse?.map((item, i) => (
            <li key={i} className={styles.listItem}>
              {item.text}
            </li>
          ))}
        </ul>
        <div className={styles.meta}>Actualizado: {formatDateTime(feed.generated_at)}</div>
      </details>

      {/* Ventana de opinión (UI por ahora) */}
      <details open className={styles.block}>
        <summary className={styles.summary}>{feed.opinion?.title ?? 'Ventana de Opinión'}</summary>
        <OpinionWindowEmbedded />
      </details>

      {/* Indicadores */}
      <details open className={styles.block}>
        <summary className={styles.summary}>Indicadores clave</summary>
        <ul className={styles.kpiList}>
          {feed.kpis?.map((k, i) => (
            <li key={i} className={styles.kpiItem}>
              <span className={styles.kpiName}>{k.name}</span>
              <span className={styles.kpiValue}>{k.value}</span>
              <span className={trendClass(k.trend)}>{k.note ?? ''}</span>
            </li>
          ))}
        </ul>
      </details>

      <footer className={styles.footer}>
        <span className={styles.subtle}>Resumen semanal</span>
        <span className={styles.subtle}>{formatDateTime(feed.generated_at)}</span>
      </footer>
    </main>
  )
}
