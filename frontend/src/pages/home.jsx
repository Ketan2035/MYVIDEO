import React, { useContext, useEffect, useState } from 'react'
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
    const [creating, setCreating] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const [scheduleTitle, setScheduleTitle] = useState('');
    const [scheduleDate, setScheduleDate] = useState('');
    const [shareInfo, setShareInfo] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [myMeetings, setMyMeetings] = useState([]);

    const { addToUserHistory, createMeeting, getMyMeetings } = useContext(AuthContext);

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                const meetings = await getMyMeetings();
                setMyMeetings(meetings);
            } catch {
                setMyMeetings([]);
            }
        };

        loadMeetings();
    }, [getMyMeetings]);

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

    const refreshMeetings = async () => {
        try {
            const meetings = await getMyMeetings();
            setMyMeetings(meetings);
        } catch {
            setMyMeetings([]);
        }
    };

    const handleCreateMeeting = async () => {
        setCreating(true);
        setFeedback('');
        try {
            const result = await createMeeting({ title: 'Instant Meeting' });
            setShareInfo(result);
            await refreshMeetings();
        } catch (error) {
            setFeedback(error?.response?.data?.message || 'Could not create meeting.');
        } finally {
            setCreating(false);
        }
    };

    const handleScheduleMeeting = async () => {
        if (!scheduleDate) {
            setFeedback('Choose a date and time for the scheduled meeting.');
            return;
        }

        setScheduling(true);
        setFeedback('');
        try {
            const result = await createMeeting({
                title: scheduleTitle || 'Scheduled Meeting',
                scheduledFor: new Date(scheduleDate).toISOString()
            });
            setShareInfo(result);
            setScheduleTitle('');
            setScheduleDate('');
            await refreshMeetings();
        } catch (error) {
            setFeedback(error?.response?.data?.message || 'Could not schedule meeting.');
        } finally {
            setScheduling(false);
        }
    };

    const handleCopyMeetingLink = async () => {
        if (!shareInfo?.link) return;

        try {
            await navigator.clipboard.writeText(shareInfo.link);
            setFeedback('Meeting link copied.');
        } catch {
            setFeedback(shareInfo.link);
        }
    };

    const handleStartSharedMeeting = async () => {
        if (!shareInfo?.code) return;
        try {
            await addToUserHistory(shareInfo.code);
        } catch {
            // Joining should still work if history cannot be saved.
        }
        navigate(`/${shareInfo.code}`);
    };

    const formatScheduledTime = (value) => {
        if (!value) return 'Instant';
        return new Date(value).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                            disabled={creating}
                        >
                            {creating ? 'Creating...' : '+ Create New Meeting'}
                        </button>

                        {shareInfo && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '10px',
                            }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                                    Share this meeting link
                                </p>
                                <p style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.82rem',
                                    wordBreak: 'break-all',
                                    marginBottom: '0.75rem',
                                }}>
                                    {shareInfo.link}
                                </p>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    <button
                                        id="copy-meeting-link-btn"
                                        style={{ ...btnStyle.base, ...btnStyle.ghost, borderRadius: '10px' }}
                                        onClick={handleCopyMeetingLink}
                                    >
                                        Copy Link
                                    </button>
                                    <button
                                        id="start-created-meeting-btn"
                                        style={{ ...btnStyle.base, ...btnStyle.primary, borderRadius: '10px' }}
                                        onClick={handleStartSharedMeeting}
                                    >
                                        Start
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.03)',
                        }}>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>
                                Schedule a Meeting
                            </p>
                            <input
                                id="schedule-title-input"
                                type="text"
                                placeholder="Meeting title"
                                value={scheduleTitle}
                                onChange={(e) => setScheduleTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    marginBottom: '0.7rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                }}
                            />
                            <input
                                id="schedule-date-input"
                                type="datetime-local"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    marginBottom: '0.8rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                }}
                            />
                            <button
                                id="schedule-meeting-btn"
                                style={{
                                    ...btnStyle.base,
                                    ...btnStyle.ghost,
                                    width: '100%',
                                    borderRadius: '10px',
                                    opacity: scheduling ? 0.7 : 1,
                                }}
                                onClick={handleScheduleMeeting}
                                disabled={scheduling}
                            >
                                {scheduling ? 'Scheduling...' : 'Schedule Meeting'}
                            </button>
                        </div>

                        {myMeetings.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
                                    Upcoming and recent meetings
                                </p>
                                {myMeetings.slice(0, 3).map((meeting) => (
                                    <div
                                        key={meeting._id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.7rem 0',
                                            borderTop: '1px solid var(--color-border)',
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ color: 'var(--text-primary)', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                                                {meeting.title || 'MyVideo Meeting'}
                                            </p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                                                {meeting.meetingCode} · {formatScheduledTime(meeting.scheduledFor)}
                                            </p>
                                        </div>
                                        <button
                                            style={{ ...btnStyle.base, ...btnStyle.ghost, padding: '0.45rem 0.8rem', borderRadius: '10px' }}
                                            onClick={() => setShareInfo({
                                                code: meeting.meetingCode,
                                                link: `${window.location.origin}/${meeting.meetingCode}`,
                                                meeting
                                            })}
                                        >
                                            Share
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {feedback && (
                            <p style={{
                                marginTop: '0.8rem',
                                color: feedback.includes('copied') ? '#06b6d4' : '#ef4444',
                                fontSize: '0.8rem',
                            }}>
                                {feedback}
                            </p>
                        )}

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
