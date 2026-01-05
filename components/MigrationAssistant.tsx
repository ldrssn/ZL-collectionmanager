import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import MaterialIcon from './MaterialIcon';
import { Item } from '../types';
import { saveItemsToCloud, fetchItemsFromCloud } from '../services/itemService';

interface MigrationAssistantProps {
    userId: string;
    onMigrationComplete: () => void;
}

export const MigrationAssistant: React.FC<MigrationAssistantProps> = ({ userId, onMigrationComplete }) => {
    const [localData, setLocalData] = useState<Item[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [isMigrated, setIsMigrated] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('ZoeLuCollection');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setLocalData(parsed);
                }
            } catch (e) {
                console.error('Failed to parse local data', e);
            }
        }
    }, []);

    const handleMigration = async () => {
        if (!localData) return;
        setLoading(true);
        setMessage(null);

        try {
            // 1. Fetch existing cloud items
            const cloudItems = await fetchItemsFromCloud(userId);

            // 2. Identify duplicates based on content (Name + Type + Shape + Color)
            // Helper to generate a unique fingerprint for an item
            const getFingerprint = (item: Item) => {
                const colorStr = Array.isArray(item.color) ? [...item.color].sort().join(',') : item.color;
                return `${item.name}|${item.type}|${item.shape}|${colorStr}`;
            };

            const cloudFingerprints = new Set(cloudItems.map(getFingerprint));

            // 3. Filter local items
            const newItemsToSync: Item[] = [];
            const duplicateItems: Item[] = [];

            localData.forEach(item => {
                if (cloudFingerprints.has(getFingerprint(item))) {
                    duplicateItems.push(item);
                } else {
                    newItemsToSync.push(item);
                }
            });

            // 4. Upload only new items
            if (newItemsToSync.length > 0) {
                // Regenerate IDs for new items to prevent collision
                const itemsToUpload = newItemsToSync.map(item => ({
                    ...item,
                    id: crypto.randomUUID(), // New unique ID
                    user_id: userId
                }));
                await saveItemsToCloud(userId, itemsToUpload);
            }

            // Clear local storage after successful migration check
            // localStorage.removeItem('ZoeLuCollection'); REMOVED AUTO CLEANUP
            // setLocalData(null);

            setIsMigrated(true);
            onMigrationComplete();

            // 5. Show specific success/info message
            if (newItemsToSync.length > 0 && duplicateItems.length > 0) {
                setMessage({ type: 'success', text: `Migration erfolgreich! ${newItemsToSync.length} Teile wurden synchronisiert. ${duplicateItems.length} Teile waren bereits in der Cloud und wurden übersprungen.` });
            } else if (newItemsToSync.length > 0) {
                setMessage({ type: 'success', text: `Migration erfolgreich! ${newItemsToSync.length} Teile wurden in die Cloud gesichert.` });
            } else {
                setMessage({ type: 'success', text: 'Alle Teile sind bereits in der Cloud vorhanden. Keine neuen Daten zu synchronisieren.' });
            }

        } catch (e: any) {
            console.error('Migration failed', e);
            setMessage({ type: 'error', text: e.message || 'Bei der Migration ist ein Fehler aufgetreten.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        if (window.confirm('Sind Sie sicher? Dies wird die lokalen Daten löschen, ohne sie in die Cloud zu übertragen.')) {
            localStorage.removeItem('ZoeLuCollection');
            setLocalData(null);
        }
    };

    const handleCleanup = () => {
        if (window.confirm('Möchten Sie die lokalen Daten nun wirklich löschen? Ihre Daten sind bereits sicher in der Cloud.')) {
            localStorage.removeItem('ZoeLuCollection');
            setLocalData(null);
            setIsMigrated(false);
            setMessage(null);
        }
    };

    if (!localData && !message) return null;

    const migrationTitle = 'Migrations-Assistent';
    const migrationPrompt = isMigrated
        ? 'Synchronisation abgeschlossen. Sie können die lokalen Daten nun bereinigen.'
        : (localData
            ? `Wir haben <strong>${localData.length} Teile</strong> in Ihrem lokalen Browser-Speicher gefunden. Möchten Sie diese mit Ihrem Cloud-Konto synchronisieren?`
            : 'Migration abgeschlossen.');
    const migratingText = 'Synchronisiere...';
    const migrateButton = 'In die Cloud laden';
    const dismissButton = 'Verwerfen';
    const cleanupButton = 'Lokale Daten löschen';

    return (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-brand-pink/20 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="bg-rose-50 dark:bg-zinc-700 p-3 rounded-full flex items-center justify-center">
                                <MaterialIcon name="cloud_upload" className="h-6 w-6 text-brand-pink" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {migrationTitle}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: migrationPrompt }} />

                            {message && (
                                <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'error'
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                                    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {localData && !isMigrated && (
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleMigration}
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-text" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {migratingText}
                                            </>
                                        ) : (
                                            <>
                                                <MaterialIcon name="sync_problem" className="-ml-1 mr-2 text-base" />
                                                {migrateButton}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark transition-all disabled:opacity-50"
                                    >
                                        {dismissButton}
                                    </button>
                                </div>
                            )}

                            {isMigrated && (
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={handleCleanup}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark transition-all"
                                    >
                                        <MaterialIcon name="delete_sweep" className="-ml-1 mr-2 text-base text-gray-500" />
                                        {cleanupButton}
                                    </button>
                                </div>
                            )}
                        </div>
                        {localData && (
                            <button
                                onClick={handleDismiss}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                <MaterialIcon name="close" className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
