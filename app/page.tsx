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
      {/* Scene 1: Pulso */}
      <section className={styles.scene}>
        <div className={styles.panel}>
          <details open className={styles.block}>
            <summary className={styles.summary}>Pulso del gremio</summary>
            {feed.pulse?.length > 0 ? (
              <ul className={styles.list}>
                {feed.pulse.map((item, i) => (
                  <li key={i} className={styles.listItem}>
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>Contenido próximamente.</p>
            )}
            <div className={styles.meta}>Actualizado: {formatDateTime(feed.generated_at)}</div>
          </details>
        </div>
      </section>

      {/* Scene 2: Ventana de opinión */}
      <section className={styles.scene}>
        <div className={styles.panel}>
          <details open className={styles.blockPrimary}>
            <summary className={styles.summary}>{feed.opinion?.title ?? 'Ventana de Opinión'}</summary>
            <OpinionWindowEmbedded />
          </details>
        </div>
      </section>

      {/* Scene 3: Indicadores */}
      <section className={styles.scene}>
        <div className={styles.panel}>
          <details open className={styles.block}>
            <summary className={styles.summary}>Indicadores clave</summary>
            {feed.kpis?.length > 0 ? (
              <ul className={styles.kpiList}>
                {feed.kpis.map((k, i) => {
                  const isBadge = /^En\s/i.test(k.value)
                  return (
                    <li key={i} className={styles.kpiItem}>
                      <span className={styles.kpiName}>{k.name}</span>
                      <span className={styles.kpiValue}>
                        {isBadge ? (
                          <span className={styles.badge}>{k.value}</span>
                        ) : (
                          k.value
                        )}
                      </span>
                      <span className={trendClass(k.trend)}>{k.note ?? ''}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className={styles.emptyState}>Contenido próximamente.</p>
            )}
          </details>
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.subtle}>Resumen semanal</span>
        <span className={styles.subtle}>{formatDateTime(feed.generated_at)}</span>
      </footer>
    </main>
  )
}
