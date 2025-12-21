'use client'

import { useMemo, useState } from 'react'
import styles from '@/app/page.module.css'

type PrivacyMode = 'anonymous' | 'followup'

export default function OpinionWindowEmbedded() {
    const MIN_CHARS = 20

    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [mode, setMode] = useState<PrivacyMode>('anonymous')
    const [stage, setStage] = useState<'draft' | 'review' | 'done'>('draft')
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit() {
        setErrorMessage(null)
        setSubmitting(true)
        try {
            const res = await fetch('/api/sugerencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titulo: 'Sugerencia',
                    contenido: text,
                    privacy_mode: mode,
                }),
            })

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Para seguimiento necesitas iniciar sesión.')
                }
                const txt = await res.text().catch(() => '')
                throw new Error(txt || `Error HTTP ${res.status}`)
            }

            setStage('done')
        } catch (e: any) {
            setErrorMessage(e?.message ?? 'No se pudo enviar.')
        } finally {
            setSubmitting(false)
        }
    }

    const count = text.trim().length
    const canContinue = useMemo(() => count >= MIN_CHARS, [count])

    function reset() {
        setText('')
        setMode('anonymous')
        setStage('draft')
        setErrorMessage(null) // Also reset error message
    }

    return (
        <div className={styles.opinionWrap}>
            {/* Estado compacto */}
            {!open && (
                <div className={styles.opinionCompactRow}>
                    <p className={styles.subtle}>
                        Idea, crítica, alerta o algo bueno. Anónimo si quieres.
                    </p>
                    <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={() => setOpen(true)}
                    >
                        Opinar
                    </button>
                </div>
            )}

            {/* Estado expandido (embebido, no modal) */}
            {open && (
                <div className={styles.opinionExpanded}>
                    <div className={styles.opinionHeaderRow}>
                        <div className={styles.opinionTitle}>Escribe tu opinión</div>
                        <button
                            type="button"
                            className={styles.btnGhost}
                            onClick={() => setOpen(false)}
                        >
                            Minimizar
                        </button>
                    </div>

                    {/* Draft */}
                    {stage === 'draft' && (
                        <>
                            <textarea
                                className={styles.textarea}
                                rows={5}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Escribe aquí. Puede ser breve o largo."
                            />

                            <div className={styles.opinionMetaRow}>
                                <span className={styles.subtle}>
                                    Privacidad: tu identidad nunca es pública.
                                </span>
                                <span className={styles.subtle}>
                                    {count}/{MIN_CHARS} mín.
                                </span>
                            </div>

                            <div className={styles.modeRow}>
                                <button
                                    type="button"
                                    className={mode === 'anonymous' ? styles.modeActive : styles.modeBtn}
                                    onClick={() => setMode('anonymous')}
                                >
                                    Enviar anónimo
                                </button>
                                <button
                                    type="button"
                                    className={mode === 'followup' ? styles.modeActive : styles.modeBtn}
                                    onClick={() => setMode('followup')}
                                >
                                    Con seguimiento
                                </button>
                            </div>

                            {mode === 'followup' && (
                                <div className={styles.notice}>
                                    Con seguimiento: luego podrás iniciar sesión aquí mismo (sin redirección).
                                </div>
                            )}

                            <div className={styles.actionsRow}>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    disabled={!canContinue}
                                    onClick={() => setStage('review')}
                                >
                                    Continuar
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    onClick={reset}
                                    disabled={text.length === 0}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </>
                    )}

                    {/* Review (UI pre-envío) */}
                    {stage === 'review' && (
                        <div className={styles.innerPanel}>
                            <div className={styles.panelTitle}>Antes de enviar</div>
                            <p className={styles.subtle}>
                                Modo: {mode === 'anonymous' ? 'Anónimo' : 'Con seguimiento'}
                            </p>

                            <div className={styles.preview}>
                                {text}
                            </div>

                            {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

                            <div className={styles.actionsRow}>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Enviando…' : 'Enviar'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    onClick={() => setStage('draft')}
                                    disabled={submitting}
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Done (UI-only) */}
                    {stage === 'done' && (
                        <div className={styles.successBox}>
                            <div className={styles.panelTitle}>Recibido</div>
                            <p className={styles.subtle}>
                                Gracias por tu aporte.
                            </p>
                            <div className={styles.actionsRow}>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={reset}
                                >
                                    Escribir otra
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    onClick={() => setOpen(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
