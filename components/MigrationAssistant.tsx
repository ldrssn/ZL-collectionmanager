import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Item } from '../types';

interface MigrationAssistantProps {
    userId: string;
    onMigrationComplete: () => void;
}

export const MigrationAssistant: React.FC<MigrationAssistantProps> = ({ userId, onMigrationComplete }) => {
    const [localData, setLocalData] = useState<Item[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

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
            // Map local items to database columns
            const itemsToInsert = localData.map(item => ({
                id: item.id,
                user_id: userId,
                name: item.name,
                photo: item.photo,
                type: item.type,
                shape: item.shape,
                color: item.color,
                price: item.price,
                purchase_price: item.purchasePrice || null,
                usage_count: item.usageCount,
                is_sold: item.isSold,
                selling_price: item.sellingPrice || null,
                notes: item.notes || null
            }));

            const { error: insertError } = await supabase
                .from('items')
                .upsert(itemsToInsert);

            if (insertError) throw insertError;

            // Clear local storage after successful migration
            localStorage.removeItem('ZoeLuCollection');
            setLocalData(null);
            onMigrationComplete();
            setMessage({ type: 'success', text: 'Migration erfolgreich! Ihre Sammlung ist nun in der Cloud gesichert.' });
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

    if (!localData && !message) return null;

    const migrationTitle = 'Migrations-Assistent';
    const migrationPrompt = localData
        ? `Wir haben <strong>${localData.length} Teile</strong> in Ihrem lokalen Browser-Speicher gefunden. Möchten Sie diese mit Ihrem Cloud-Konto synchronisieren?`
        : 'Migration abgeschlossen.';
    const migratingText = 'Synchronisiere...';
    const migrateButton = 'In die Cloud laden';
    const dismissButton = 'Verwerfen';

    return (
        <div className="w-full mb-6 animate-in fade-in slide-in-from-top duration-500">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-brand-pink/20 overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="bg-rose-50 dark:bg-zinc-700 p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
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

                            {localData && (
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
                                                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
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
                        </div>
                        {localData && (
                            <button
                                onClick={handleDismiss}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
