import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert } from '@mui/material';

const styles = {
    page: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        background: 'var(--color-bg)',
        overflow: 'hidden',
    },
    leftPanel: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        background: 'linear-gradient(135deg, rgba(32, 30, 36, 0.15) 0%, rgba(6,182,212,0.08) 100%)',
        borderRight: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
    },
    leftPanelOrb1: {
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    leftPanelOrb2: {
        position: 'absolute',
        bottom: '-80px',
        right: '-80px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    leftContent: {
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '400px',
    },
    brand: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '1rem',
        letterSpacing: '-0.03em',
    },
    tagline: {
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        lineHeight: '1.7',
        marginBottom: '2rem',
    },
    illustrationGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        marginTop: '1.5rem',
    },
    illustrationCard: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '1rem',
        textAlign: 'left',
    },
    illustrationCardIcon: {
        fontSize: '1.4rem',
        marginBottom: '0.4rem',
        display: 'block',
    },
    illustrationCardText: {
        color: 'var(--text-secondary)',
        fontSize: '0.78rem',
        lineHeight: '1.4',
    },
    rightPanel: {
        width: '440px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2.5rem',
    },
    formCard: {
        width: '100%',
        maxWidth: '380px',
    },
    formTitle: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '1.8rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '0.4rem',
        letterSpacing: '-0.02em',
    },
    formSubtitle: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        marginBottom: '2rem',
    },
    tabs: {
        display: 'flex',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '1.8rem',
    },
    tab: (active) => ({
        flex: 1,
        padding: '0.55rem 1rem',
        borderRadius: '7px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.88rem',
        fontWeight: '600',
        transition: 'all 250ms ease',
        background: active ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
        color: active ? 'white' : 'var(--text-secondary)',
        boxShadow: active ? '0 2px 12px rgba(124,58,237,0.4)' : 'none',
    }),
    inputGroup: {
        marginBottom: '1rem',
    },
    inputLabel: {
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        marginBottom: '0.45rem',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'all 250ms ease',
    },
    submitBtn: (loading) => ({
        width: '100%',
        padding: '0.85rem',
        marginTop: '1.5rem',
        background: loading
            ? 'rgba(28, 26, 31, 0.4)'
            : 'linear-gradient(135deg, #1b1a1fff, #313c3fff)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: '600',
        fontFamily: "'Inter', sans-serif",
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 250ms ease',
        boxShadow: loading ? 'none' : '0 0 20px rgba(21, 20, 24, 0.4)',
        letterSpacing: '0.02em',
    }),
    errorText: {
        color: '#ef4444',
        fontSize: '0.83rem',
        marginTop: '0.75rem',
        padding: '0.6rem 0.9rem',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '8px',
    },
};

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [inputFocus, setInputFocus] = React.useState({});

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleFocus = (field) => setInputFocus(prev => ({ ...prev, [field]: true }));
    const handleBlur = (field) => setInputFocus(prev => ({ ...prev, [field]: false }));

    const inputStyle = (field) => ({
        ...styles.input,
        borderColor: inputFocus[field] ? '#7c3aed' : 'var(--color-border)',
        boxShadow: inputFocus[field] ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
        background: inputFocus[field] ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.05)',
    });

    let handleAuth = async () => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                setUsername('');
                setPassword('');
                setName('');
                setMessage(result || 'Account created! Please sign in.');
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAuth();
    };

    return (
        <div style={styles.page}>
            {/* Left decorative panel */}
            <div style={styles.leftPanel}>
                <div style={styles.leftPanelOrb1} />
                <div style={styles.leftPanelOrb2} />
                <div style={styles.leftContent}>
                    <div style={styles.brand}>MyVideo</div>
                    <p style={styles.tagline}>
                        Connect face-to-face with anyone, anywhere.<br />
                        Secure, real-time video calls powered by WebRTC.
                    </p>
                    <div style={styles.illustrationGrid}>
                        <div style={styles.illustrationCard}>
                            <span style={styles.illustrationCardIcon}>🎥</span>
                            <p style={styles.illustrationCardText}>HD Video Calls</p>
                        </div>
                        <div style={styles.illustrationCard}>
                            <span style={styles.illustrationCardIcon}>🔒</span>
                            <p style={styles.illustrationCardText}>End-to-End Encrypted</p>
                        </div>
                        <div style={styles.illustrationCard}>
                            <span style={styles.illustrationCardIcon}>💬</span>
                            <p style={styles.illustrationCardText}>In-Call Chat</p>
                        </div>
                        <div style={styles.illustrationCard}>
                            <span style={styles.illustrationCardIcon}>🖥️</span>
                            <p style={styles.illustrationCardText}>Screen Sharing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div style={styles.rightPanel}>
                <div style={styles.formCard}>
                    <h1 style={styles.formTitle}>
                        {formState === 0 ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p style={styles.formSubtitle}>
                        {formState === 0
                            ? 'Sign in to access your meetings and history.'
                            : 'Join MyVideo to start making free video calls.'}
                    </p>

                    {/* Tab toggle */}
                    <div style={styles.tabs}>
                        <button
                            id="signin-tab"
                            style={styles.tab(formState === 0)}
                            onClick={() => { setFormState(0); setError(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            id="signup-tab"
                            style={styles.tab(formState === 1)}
                            onClick={() => { setFormState(1); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form fields */}
                    {formState === 1 && (
                        <div style={styles.inputGroup}>
                            <label style={styles.inputLabel}>Full Name</label>
                            <input
                                id="full-name-input"
                                style={inputStyle('name')}
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => handleFocus('name')}
                                onBlur={() => handleBlur('name')}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Username</label>
                        <input
                            id="username-input"
                            style={inputStyle('username')}
                            type="text"
                            placeholder="your_username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => handleFocus('username')}
                            onBlur={() => handleBlur('username')}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Password</label>
                        <input
                            id="password-input"
                            style={inputStyle('password')}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {error && <p style={styles.errorText}>⚠ {error}</p>}

                    <button
                        id="auth-submit-btn"
                        style={styles.submitBtn(loading)}
                        onClick={handleAuth}
                        disabled={loading}
                    >
                        {loading
                            ? '⏳ Please wait...'
                            : formState === 0 ? 'Sign In →' : 'Create Account →'}
                    </button>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}