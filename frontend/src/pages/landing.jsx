import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>MyVideo</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => router("/aljk23")}>Join as Guest</p>
                    <p onClick={() => router("/auth")}>Register</p>
                    <div onClick={() => router("/auth")} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h1>
                        <span>Connect</span> with<br />
                        your loved ones
                    </h1>
                    <p>
                        Simple, reliable video calls. No downloads,<br />
                        no account needed for guests.
                    </p>
                    <div role='button'>
                        <Link to={"/auth"}>Get started →</Link>
                    </div>
                </div>
                <div>
                    <img src="/mobile.png" alt="Video calling illustration" />
                </div>
            </div>

            <div className="featuresSection">
                <div className="featureCard">
                    <span className="featureIcon">🎥</span>
                    <h3>HD Video</h3>
                    <p>Crisp, clear video with adaptive quality based on your connection.</p>
                </div>
                <div className="featureCard">
                    <span className="featureIcon">🔒</span>
                    <h3>Private by default</h3>
                    <p>Peer-to-peer WebRTC. Your calls go directly, not through our servers.</p>
                </div>
                <div className="featureCard">
                    <span className="featureIcon">💬</span>
                    <h3>In-call chat</h3>
                    <p>Send messages and links during your call without interrupting the flow.</p>
                </div>
                <div className="featureCard">
                    <span className="featureIcon">🖥️</span>
                    <h3>Screen share</h3>
                    <p>Share your screen instantly — no plugins or extensions required.</p>
                </div>
            </div>
        </div>
    )
}
