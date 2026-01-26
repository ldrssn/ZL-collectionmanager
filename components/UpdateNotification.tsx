import React, { useState, useEffect } from 'react';
import MaterialIcon from './MaterialIcon';
import { renderFormattedMessage } from '../services/formatService';

interface UpdateNotificationProps {
    id: string;
    title: string;
    message: string;
    buttonText: string;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ id, title, message, buttonText }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const dismissedId = localStorage.getItem('dismissedUpdateId');
        if (dismissedId !== id) {
            setIsVisible(true);
        }
    }, [id]);

    const handleClose = () => {
        localStorage.setItem('dismissedUpdateId', id);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-sm font-bold">
                            <div className="bg-brand-pink w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg mr-3 shadow-sm">
                                <MaterialIcon name="campaign" className="text-2xl text-zinc-800" />
                            </div>
                            UPDATE                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {title}
                        </h3>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {renderFormattedMessage(message)}
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-full bg-brand-pink hover:bg-brand-pink-dark text-zinc-900 font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotification;
