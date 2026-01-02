import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Password Validation Logic
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && password !== '';

    const isPasswordValid = hasMinLength && hasUpperCase && hasNumber && (!isSignUp || passwordsMatch);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignUp && !isPasswordValid) {
            setMessage({ type: 'error', text: 'Bitte erfüllen Sie alle Passwort-Anforderungen.' });
            return;
        }

        setMessage(null);
        setLoading(true);

        const { error } = isSignUp
            ? await supabase.auth.signUp({ email, password })
            : await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            // Translate common Supabase error messages
            let errorMessage = error.message;
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'E-Mail-Adresse wurde noch nicht bestätigt. Bitte prüfen Sie Ihren Posteingang.';
            } else if (error.message.includes('User already registered')) {
                errorMessage = 'Diese E-Mail-Adresse ist bereits registriert.';
            }
            setMessage({ type: 'error', text: errorMessage });
        } else if (isSignUp) {
            setShowConfirmation(true);
        }
        setLoading(false);
    };

    const RequirementItem: React.FC<{ met: boolean, text: string }> = ({ met, text }) => (
        <div className="flex items-center space-x-2 text-xs">
            {met ? (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            <span className={met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>{text}</span>
        </div>
    );

    if (showConfirmation) {
        return (
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-md text-center">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brand-pink animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            E-Mail bestätigen
                        </h2>
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100 dark:border-zinc-700/50">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Bitte bestätige deine E-Mail Adresse, indem du auf den Link in der Bestätigungsmail klickst.<br /><br />
                                Der Absender der E-Mail lautet <strong>Supabase Auth</strong>.<br />
                                Prüfe auch deinen Spam Ordner.
                            </p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setShowConfirmation(false);
                                setIsSignUp(false);
                                setMessage(null);
                            }}
                            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark transition-colors"
                        >
                            Zurück zum Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-md text-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Willkommen beim Collection Manager
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {isSignUp
                            ? 'Erstelle einfach ein Konto und sichere deine Sammlung in der Cloud.'
                            : 'Melde dich an, um auf deine Sammlung zuzugreifen.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                    <div className="space-y-4 text-left">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-zinc-600 placeholder-gray-500 dark:placeholder-zinc-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-brand-pink focus:border-brand-pink focus:z-10 sm:text-sm bg-white dark:bg-zinc-700"
                                placeholder="ihre@email.de"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passwort</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-zinc-600 placeholder-gray-500 dark:placeholder-zinc-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-brand-pink focus:border-brand-pink focus:z-10 sm:text-sm bg-white dark:bg-zinc-700"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {isSignUp && (
                            <>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passwort bestätigen</label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 dark:border-zinc-600 placeholder-gray-500 dark:placeholder-zinc-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-brand-pink focus:border-brand-pink focus:z-10 sm:text-sm bg-white dark:bg-zinc-700"
                                        placeholder="********"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1 mt-2 p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-md">
                                    <RequirementItem met={hasMinLength} text="Mindestens 6 Zeichen" />
                                    <RequirementItem met={hasUpperCase} text="Ein Großbuchstabe" />
                                    <RequirementItem met={hasNumber} text="Eine Zahl" />
                                    <RequirementItem met={passwordsMatch} text="Passwörter stimmen überein" />
                                </div>
                            </>
                        )}
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading || (isSignUp && !isPasswordValid)}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isSignUp ? 'Konto erstellen' : 'Anmelden'}
                        </button>
                    </div>
                </form>

                <div className="text-sm">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage(null);
                            setConfirmPassword('');
                        }}
                        className="font-medium text-gray-600 dark:text-gray-400 hover:text-brand-pink-dark dark:hover:text-brand-pink underline transition-colors"
                    >
                        {isSignUp ? 'Bereits ein Konto? Jetzt anmelden' : 'Noch kein Konto? Hier registrieren'}
                    </button>
                </div>
            </div>
        </div>
    );
};
