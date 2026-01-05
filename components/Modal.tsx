import React from 'react';
import MaterialIcon from './MaterialIcon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center lg:p-4">
      <div className="bg-white dark:bg-zinc-800 w-full h-full lg:rounded-lg lg:shadow-xl lg:max-w-[600px] lg:w-full lg:max-h-[95vh] flex flex-col">
        <div className="flex-shrink-0 flex justify-between items-center p-4 lg:p-6 border-b dark:border-zinc-700">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-zinc-600 dark:hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" aria-label="Schließen">
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>
        <div className="flex-grow p-4 lg:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;