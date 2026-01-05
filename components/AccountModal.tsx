import React, { useState, useEffect } from 'react';
import { updateUserEmail, updateUserPassword, updateCollectionName } from '../services/authService';
import MaterialIcon from './MaterialIcon';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string | undefined;
    onLogout: () => void;
    onExport: () => void;
    onImportClick: () => void;
    collectionName?: string;
    onCollectionNameUpdate: (name: string) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
    isOpen,
    onClose,
    userEmail,
    onLogout,
    onExport,
    onImportClick,
    collectionName,
    onCollectionNameUpdate,
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'data'>('profile');
    const [newCollectionName, setNewCollectionName] = useState(collectionName || '');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    // Password Validation Logic
    const hasMinLength = newPassword.length >= 6;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
    const isPasswordValid = hasMinLength && hasUpperCase && hasNumber && passwordsMatch;

    // Sync newCollectionName with collectionName prop when it changes
    useEffect(() => {
        setNewCollectionName(collectionName || '');
    }, [collectionName]);

    const RequirementItem: React.FC<{ met: boolean, text: string }> = ({ met, text }) => (
        <div className="flex items-center space-x-2 text-xs">
            {met ? (
                <MaterialIcon name="check" className="h-4 w-4 text-green-500" />
            ) : (
                <MaterialIcon name="close" className="h-4 w-4 text-red-500" />
            )}
            <span className={met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>{text}</span>
        </div>
    );

    if (!isOpen) return null;

    const handleUpdateCollectionName = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const nameToSave = newCollectionName.trim() || 'My ZoéLu Collection';
            const { error } = await updateCollectionName(nameToSave);
            if (error) throw error;
            onCollectionNameUpdate(nameToSave);
            setNewCollectionName(nameToSave);
            setMessage({ type: 'success', text: 'Sammlungsname erfolgreich aktualisiert!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Fehler beim Aktualisieren des Namens.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await updateUserEmail(newEmail);
            if (error) throw error;
            setMessage({ type: 'success', text: 'Bestätigungs-Email gesendet! Bitte prüfen Sie Ihr Postfach.' });
            setNewEmail('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Fehler beim Aktualisieren der Email.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPasswordValid) {
            setMessage({ type: 'error', text: 'Bitte erfüllen Sie alle Passwort-Anforderungen.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const { error } = await updateUserPassword(newPassword);
            if (error) throw error;
            setMessage({ type: 'success', text: 'Passwort erfolgreich geändert!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Fehler beim Ändern des Passworts.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center lg:p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

            <div className="bg-white dark:bg-zinc-800 w-full h-full lg:h-auto lg:rounded-lg lg:shadow-xl lg:max-w-[600px] lg:w-full relative z-10 flex flex-col pointer-events-auto">
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-100 dark:border-zinc-700">
                    <div className="text-left w-full">
                        <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100" id="modal-title">
                            Mein Konto
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="bg-white dark:bg-zinc-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink ml-4"
                    >
                        <span className="sr-only">Schließen</span>
                        <MaterialIcon name="close" className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left w-full">

                            <div className="mt-4 border-b border-gray-200 dark:border-zinc-700">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`${activeTab === 'profile'
                                            ? 'border-brand-pink text-brand-pink'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        Profil & Sicherheit
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('data')}
                                        className={`${activeTab === 'data'
                                            ? 'border-brand-pink text-brand-pink'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    >
                                        Datenverwaltung
                                    </button>
                                </nav>
                            </div>

                            <div className="mt-4">
                                {message && (
                                    <div className={`p-2 rounded-md mb-4 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {message.text}
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">Sammlungsname</h4>
                                            <form onSubmit={handleUpdateCollectionName} className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="z.B. Meine Zoé Lu Schätze"
                                                    className="block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-brand-pink focus:ring-brand-pink dark:bg-zinc-700 dark:text-white sm:text-sm p-2 bg-gray-50"
                                                    value={newCollectionName}
                                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading || newCollectionName === collectionName}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink disabled:opacity-50 transition-colors w-full sm:w-auto"
                                                >
                                                    {loading ? 'Speichern...' : 'Name speichern'}
                                                </button>
                                            </form>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-zinc-700 pt-6">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">Email ändern</h4>
                                            <form onSubmit={handleUpdateEmail} className="space-y-3">
                                                <input
                                                    type="email"
                                                    placeholder="Neue Email-Adresse"
                                                    className="block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-brand-pink focus:ring-brand-pink dark:bg-zinc-700 dark:text-white sm:text-sm p-2 bg-gray-50"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink disabled:opacity-50 transition-colors w-full sm:w-auto"
                                                >
                                                    {loading ? 'Speichern...' : 'Email aktualisieren'}
                                                </button>
                                            </form>
                                        </div>

                                        <div className="border-t border-gray-100 dark:border-zinc-700 pt-6">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">Passwort ändern</h4>
                                            <form onSubmit={handleUpdatePassword} className="space-y-3">
                                                <input
                                                    type="password"
                                                    placeholder="Neues Passwort"
                                                    className="block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-brand-pink focus:ring-brand-pink dark:bg-zinc-700 dark:text-white sm:text-sm p-2 bg-gray-50"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Passwort bestätigen"
                                                    className="block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-brand-pink focus:ring-brand-pink dark:bg-zinc-700 dark:text-white sm:text-sm p-2 bg-gray-50"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                    minLength={6}
                                                />
                                                <div className="space-y-1 mt-2 p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-md">
                                                    <RequirementItem met={hasMinLength} text="Mindestens 6 Zeichen" />
                                                    <RequirementItem met={hasUpperCase} text="Ein Großbuchstabe" />
                                                    <RequirementItem met={hasNumber} text="Eine Zahl" />
                                                    <RequirementItem met={passwordsMatch} text="Passwörter stimmen überein" />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={loading || !isPasswordValid}
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink disabled:opacity-50 transition-colors w-full sm:w-auto"
                                                >
                                                    {loading ? 'Speichern...' : 'Passwort ändern'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'data' && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Importieren oder exportieren Sie Ihre gesamte Sammlung als JSON-Datei.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <button
                                                type="button"
                                                onClick={onExport}
                                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink dark:bg-zinc-700 dark:text-gray-200 dark:border-zinc-600 dark:hover:bg-zinc-600"
                                            >
                                                <MaterialIcon name="file_download" className="-ml-1 mr-2 text-xl text-gray-500" />
                                                Exportieren
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onImportClick}
                                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink dark:bg-zinc-700 dark:text-gray-200 dark:border-zinc-600 dark:hover:bg-zinc-600"
                                            >
                                                <MaterialIcon name="file_upload" className="-ml-1 mr-2 text-xl text-gray-500" />
                                                Importieren
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 sm:mt-6 sm:grid sm:grid-cols-1 sm:gap-3 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-zinc-700 pt-4">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center items-center rounded-md px-4 py-2 text-base font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transition-colors"
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                    >
                        <MaterialIcon name="logout" className="-ml-1 mr-2 text-xl" />
                        Abmelden
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
