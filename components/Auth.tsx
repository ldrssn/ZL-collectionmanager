import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else if (isSignUp) {
            setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
        }
        setLoading(false);
    };

    return (
        <div className="auth-container" style={{
            maxWidth: '400px',
            margin: '100px auto',
            padding: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isSignUp ? 'Create Account' : 'Login'}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #444',
                        backgroundColor: '#222',
                        color: 'white'
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid #444',
                        backgroundColor: '#222',
                        color: 'white'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#eb2d64',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}
                >
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
                </button>
            </form>

            {message && (
                <div style={{
                    marginTop: '1rem',
                    padding: '0.8rem',
                    borderRadius: '6px',
                    backgroundColor: message.type === 'error' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)',
                    color: message.type === 'error' ? '#ff6666' : '#66ff66',
                    fontSize: '0.9rem'
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#eb2d64',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '0'
                    }}
                >
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </div>
        </div>
    );
};
