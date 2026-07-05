import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const s = {
        page: {
            minHeight: '100vh',
            background: 'var(--color-bg)',
            backgroundImage: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.15) 0%, transparent 60%)',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 2.5rem',
            background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        },
        brand: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.4rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
        },
        backBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1.1rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--color-border)',
            borderRadius: '9999px',
            color: 'var(--text-secondary)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 250ms ease',
        },
        body: {
            padding: '3rem 2.5rem',
            maxWidth: '800px',
            margin: '0 auto',
        },
        pageTitle: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em',
        },
        pageSubtitle: {
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '2.5rem',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1rem',
        },
        card: {
            background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '1.4rem 1.6rem',
            transition: 'all 250ms ease',
            cursor: 'default',
        },
        cardTop: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
        },
        codeLabel: {
            fontSize: '0.72rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
            marginBottom: '0.3rem',
        },
        code: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
        },
        badge: {
            padding: '0.3rem 0.8rem',
            background: 'rgba(6,182,212,0.15)',
            border: '1px solid rgba(6,182,212,0.3)',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: '600',
            color: '#06b6d4',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
        },
        metaRow: {
            display: 'flex',
            gap: '1.5rem',
            marginBottom: '1.2rem',
        },
        meta: {
            color: 'var(--text-secondary)',
            fontSize: '0.83rem',
        },
        metaStrong: {
            color: 'var(--text-primary)',
            fontWeight: '500',
        },
        rejoinBtn: {
            width: '100%',
            padding: '0.65rem',
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '10px',
            color: '#9d5cff',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 250ms ease',
        },
        emptyState: {
            textAlign: 'center',
            padding: '5rem 2rem',
        },
        emptyIcon: {
            fontSize: '4rem',
            marginBottom: '1.2rem',
        },
        emptyTitle: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.4rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.6rem',
        },
        emptyText: {
            color: 'var(--text-secondary)',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            marginBottom: '2rem',
        },
        startBtn: {
            display: 'inline-block',
            padding: '0.8rem 1.8rem',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
            transition: 'all 250ms ease',
        },
        loadingText: {
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '4rem',
            fontSize: '0.95rem',
        },
    };

    return (
        <div style={s.page}>
            {/* Header */}
            <div style={s.header}>
                <span style={s.brand}>MyVideo</span>
                <button
                    id="back-home-btn"
                    style={s.backBtn}
                    onClick={() => routeTo('/home')}
                >
                    ← Back to Home
                </button>
            </div>

            {/* Body */}
            <div style={s.body}>
                <h1 style={s.pageTitle}>Meeting History</h1>
                <p style={s.pageSubtitle}>
                    {meetings.length > 0
                        ? `You've attended ${meetings.length} meeting${meetings.length !== 1 ? 's' : ''}.`
                        : 'Your past meetings will appear here.'}
                </p>

                {loading ? (
                    <p style={s.loadingText}>Loading your history...</p>
                ) : meetings.length === 0 ? (
                    <div style={s.emptyState}>
                        <div style={s.emptyIcon}>📭</div>
                        <h2 style={s.emptyTitle}>No meetings yet</h2>
                        <p style={s.emptyText}>
                            Once you join or create a meeting,<br />
                            it will show up here.
                        </p>
                        <button
                            id="go-home-btn"
                            style={s.startBtn}
                            onClick={() => routeTo('/home')}
                        >
                            Start a Meeting
                        </button>
                    </div>
                ) : (
                    <div style={s.grid}>
                        {meetings.map((e, i) => (
                            <div
                                key={i}
                                style={s.card}
                                onMouseEnter={(el) => {
                                    el.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                                    el.currentTarget.style.transform = 'translateY(-2px)';
                                    el.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)';
                                }}
                                onMouseLeave={(el) => {
                                    el.currentTarget.style.borderColor = 'var(--color-border)';
                                    el.currentTarget.style.transform = 'translateY(0)';
                                    el.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={s.cardTop}>
                                    <div>
                                        <p style={s.codeLabel}>Meeting Code</p>
                                        <p style={s.code}>{e.meetingCode}</p>
                                    </div>
                                    <span style={s.badge}>Past</span>
                                </div>

                                <div style={s.metaRow}>
                                    <div style={s.meta}>
                                        📅 <span style={s.metaStrong}>{formatDate(e.date)}</span>
                                    </div>
                                    <div style={s.meta}>
                                        🕐 <span style={s.metaStrong}>{formatTime(e.date)}</span>
                                    </div>
                                </div>

                                <button
                                    id={`rejoin-btn-${i}`}
                                    style={s.rejoinBtn}
                                    onClick={() => routeTo(`/${e.meetingCode}`)}
                                    onMouseEnter={(el) => {
                                        el.currentTarget.style.background = 'rgba(124,58,237,0.25)';
                                    }}
                                    onMouseLeave={(el) => {
                                        el.currentTarget.style.background = 'rgba(124,58,237,0.12)';
                                    }}
                                >
                                    ↩ Rejoin Meeting
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
