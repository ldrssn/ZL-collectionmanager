import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching session:', err);
            setLoading(false);
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
};

export const updateUserEmail = async (email: string) => {
    const { data, error } = await supabase.auth.updateUser({ email });
    return { data, error };
};

export const updateUserPassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    return { data, error };
};
