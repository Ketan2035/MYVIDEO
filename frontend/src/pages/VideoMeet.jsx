import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    const videoRef = useRef([])
    let [videos, setVideos] = useState([])

    // ✅ FIX: Runs only once on mount — getPermissions is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getPermissions();
    }, []);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => { setVideo(!video); }
    let handleAudio = () => { setAudio(!audio); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleScreen = () => { setScreen(!screen); }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let handleMessage = (e) => { setMessage(e.target.value); }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    }

    const handleChatKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    const handleUsernameKeyDown = (e) => {
        if (e.key === 'Enter' && username.trim()) connect();
    };

    return (
        <div>
            {askForUsername === true ? (
                /* ─── LOBBY SCREEN ─── */
                <div className={styles.lobbyContainer}>
                    <div className={styles.lobbyCard}>
                        <p className={styles.lobbyBrand}>MyVideo</p>
                        <h1 className={styles.lobbyTitle}>Join the Meeting</h1>
                        <p className={styles.lobbySubtitle}>Enter your display name to continue</p>

                        {/* Local video preview */}
                        <video
                            className={styles.lobbyVideoPreview}
                            ref={localVideoref}
                            autoPlay
                            muted
                        />

                        <input
                            id="lobby-username-input"
                            className={styles.lobbyInput}
                            type="text"
                            placeholder="Your display name"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={handleUsernameKeyDown}
                        />

                        <button
                            id="lobby-connect-btn"
                            className={styles.lobbyConnectBtn}
                            onClick={connect}
                            disabled={!username.trim()}
                        >
                            Join Meeting →
                        </button>
                    </div>
                </div>
            ) : (
                /* ─── MEETING ROOM ─── */
                <div className={styles.meetVideoContainer}>

                    {/* Chat panel */}
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHeader}>
                                    <h2>💬 Chat</h2>
                                    <button
                                        className={styles.chatCloseBtn}
                                        onClick={() => setModal(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className={styles.chattingDisplay}>
                                    {messages.length === 0 ? (
                                        <p className={styles.noMessages}>No messages yet. Say hello! 👋</p>
                                    ) : (
                                        messages.map((item, index) => (
                                            <div className={styles.chatMessage} key={index}>
                                                <span className={styles.chatMessageSender}>{item.sender}</span>
                                                <div className={styles.chatMessageBubble}>{item.data}</div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className={styles.chattingArea}>
                                    <textarea
                                        className={styles.chatInput}
                                        value={message}
                                        onChange={handleMessage}
                                        onKeyDown={handleChatKeyDown}
                                        placeholder="Type a message..."
                                        rows={1}
                                        id="chat-input"
                                    />
                                    <button
                                        id="chat-send-btn"
                                        className={styles.chatSendBtn}
                                        onClick={sendMessage}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Control bar */}
                    <div className={styles.buttonContainers}>
                        <IconButton
                            id="toggle-video-btn"
                            onClick={handleVideo}
                            style={{ color: video ? 'white' : '#94a3b8' }}
                            title={video ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton
                            id="end-call-btn"
                            onClick={handleEndCall}
                            title="End call"
                            style={{
                                color: '#ef4444',
                                background: 'rgba(239,68,68,0.15)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '50%',
                                padding: '10px',
                            }}
                        >
                            <CallEndIcon />
                        </IconButton>

                        <IconButton
                            id="toggle-audio-btn"
                            onClick={handleAudio}
                            style={{ color: audio ? 'white' : '#94a3b8' }}
                            title={audio ? 'Mute microphone' : 'Unmute microphone'}
                        >
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton
                                id="toggle-screen-btn"
                                onClick={handleScreen}
                                style={{ color: screen ? '#06b6d4' : 'white' }}
                                title={screen ? 'Stop sharing' : 'Share screen'}
                            >
                                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                        )}

                        <Badge
                            badgeContent={newMessages}
                            max={99}
                            color='error'
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
                        >
                            <IconButton
                                id="toggle-chat-btn"
                                onClick={() => {
                                    setModal(!showModal);
                                    if (!showModal) setNewMessages(0);
                                }}
                                style={{ color: showModal ? '#7c3aed' : 'white' }}
                                title="Toggle chat"
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    {/* Local video (PiP) */}
                    <video
                        className={styles.meetUserVideo}
                        ref={localVideoref}
                        autoPlay
                        muted
                    />

                    {/* Remote videos */}
                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
