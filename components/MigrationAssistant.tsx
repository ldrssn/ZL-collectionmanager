import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Item } from '../types';

interface MigrationAssistantProps {
    userId: string;
    onMigrationComplete: () => void;
}

export const MigrationAssistant: React.FC<MigrationAssistantProps> = ({ userId, onMigrationComplete }) => {
    const [localData, setLocalData] = useState<Item[] | null>(null);
    const [isMigrating, setIsMigrating] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setIsMigrating(true);
        setError(null);

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
            alert('Migration successful! Your collection is now in the cloud.');
        } catch (e: any) {
            console.error('Migration failed', e);
            setError(e.message || 'An error occurred during migration.');
        } finally {
            setIsMigrating(false);
        }
    };

    if (!localData) return null;

    return (
        <div style={{
            margin: '1rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(235, 45, 100, 0.1)',
            border: '1px solid #eb2d64',
            borderRadius: '8px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <h3 style={{ margin: 0, color: '#eb2d64' }}>Migration Assistant</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                We found <strong>{localData.length} items</strong> in your local browser storage.
                Would you like to sync them to your cloud account?
            </p>
            {error && <p style={{ color: '#ff6666', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={handleMigration}
                    disabled={isMigrating}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#eb2d64',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isMigrating ? 'Syncing...' : 'Sync to Cloud'}
                </button>
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure? This will remove the local data without syncing it to the cloud.')) {
                            localStorage.removeItem('ZoeLuCollection');
                            setLocalData(null);
                        }
                    }}
                    disabled={isMigrating}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#aaa',
                        border: '1px solid #555',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};
