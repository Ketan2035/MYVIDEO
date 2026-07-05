import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { IconButton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

const btnStyle = {
    base: {
        padding: '0.65rem 1.4rem',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.88rem',
        fontWeight: '600',
        transition: 'all 250ms ease',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--color-border)',
    },
    danger: {
        background: 'rgba(239,68,68,0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239,68,68,0.2)',
    },
    primary: {
        background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        color: 'white',
        boxShadow: '0 0 20px rgba(124,58,237,0.35)',
    },
};

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState('');
    const [inputFocused, setInputFocused] = useState(false);
    const [joining, setJoining] = useState(false);

    const { addToUserHistory } = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        setJoining(true);
        try {
            await addToUserHistory(meetingCode.trim());
            navigate(`/${meetingCode.trim()}`);
        } catch {
            navigate(`/${meetingCode.trim()}`);
        } finally {
            setJoining(false);
        }
    };

    const handleCreateMeeting = () => {
        const newCode = Math.random().toString(36).substring(2, 10);
        navigate(`/${newCode}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoinVideoCall();
    };

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
            {/* Navbar */}
            <div className="navBar">
                <div className="navBrand">MyVideo</div>
                <div className="navActions">
                    <IconButton
                        id="history-btn"
                        onClick={() => navigate('/history')}
                        title="Meeting History"
                        sx={{
                            color: 'var(--text-secondary)',
                            '&:hover': { color: 'var(--text-primary)', background: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        <HistoryIcon />
                    </IconButton>
                    <button
                        id="logout-btn"
                        style={{ ...btnStyle.base, ...btnStyle.danger }}
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/auth');
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="meetContainer">
                <div className="leftPanel">
                    <div style={{ width: '100%' }}>
                        <p style={{
                            color: 'var(--color-accent)',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            marginBottom: '0.8rem',
                        }}>
                            ● Live Now
                        </p>
                        <h2>Start or Join a<br />Video Meeting</h2>

                        {/* Join meeting input */}
                        <div className="meetInputRow">
                            <input
                                id="meeting-code-input"
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem 1.1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${inputFocused ? '#7c3aed' : 'var(--color-border)'}`,
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                    boxShadow: inputFocused ? '0 0 0 3px rgba(124,58,237,0.15)' : 'none',
                                    transition: 'all 250ms ease',
                                }}
                            />
                            <button
                                id="join-meeting-btn"
                                disabled={joining || !meetingCode.trim()}
                                style={{
                                    ...btnStyle.base,
                                    ...btnStyle.primary,
                                    opacity: !meetingCode.trim() ? 0.5 : 1,
                                    cursor: !meetingCode.trim() ? 'not-allowed' : 'pointer',
                                }}
                                onClick={handleJoinVideoCall}
                            >
                                {joining ? '...' : 'Join'}
                            </button>
                        </div>

                        <div className="meetDivider">or</div>

                        {/* Create meeting button */}
                        <button
                            id="create-meeting-btn"
                            style={{
                                ...btnStyle.base,
                                background: 'rgba(124,58,237,0.1)',
                                color: '#9d5cff',
                                border: '1px solid rgba(124,58,237,0.3)',
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                fontSize: '0.9rem',
                            }}
                            onClick={handleCreateMeeting}
                        >
                            + Create New Meeting
                        </button>

                        <p style={{
                            marginTop: '1.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.82rem',
                            lineHeight: '1.6',
                        }}>
                            Share the meeting code with others to invite them.<br />
                            No account required for guests.
                        </p>
                    </div>
                </div>

                <div className="rightPanel">
                    <img srcSet='/logo3.png' alt="Video meeting illustration" />
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent);