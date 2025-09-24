import React from 'react';
import VelocityAI from './components/VelocityAI';

const App: React.FC = () => {
    return (
        <div style={{ background: 'linear-gradient(135deg, #ece9ff 0%, #f7f7fa 100%)', minHeight: '100vh', padding: 0 }}>
            <header style={{ padding: '40px 0 16px 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: 44, color: '#6C47FF', margin: 0, fontWeight: 800, letterSpacing: -2 }}>
                    VelocityAI
                </h1>
                <p style={{ color: '#444', fontSize: 20, margin: '16px 0 0 0' }}>
                    Your elegant AI landing page and chatbot.
                </p>
            </header>
            <main>
                <VelocityAI />
            </main>
            <footer style={{ textAlign: 'center', color: '#aaa', fontSize: 14, marginTop: 40 }}>
                &copy; {new Date().getFullYear()} VelocityAI. All rights reserved.
            </footer>
        </div>
    );
};

export default App;