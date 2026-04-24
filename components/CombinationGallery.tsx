import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MaterialIcon from './MaterialIcon';

interface CombinationGalleryProps {
  items: string[];
  initialIndex?: number;
  onClose: () => void;
}

const CombinationGallery: React.FC<CombinationGalleryProps> = ({ items, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex(prev => Math.min(items.length - 1, prev + 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => Math.max(0, prev - 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when gallery is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [items.length, onClose]);

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 text-white z-10">
        <span className="text-sm font-semibold tracking-wider">{currentIndex + 1} / {items.length}</span>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <MaterialIcon name="close" className="text-2xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative flex items-center justify-center touch-none">
        {/* Prev Button (Desktop) */}
        {currentIndex > 0 && (
          <button 
            onClick={prevImage}
            className="hidden md:flex absolute left-8 z-10 w-14 h-14 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/20"
          >
            <MaterialIcon name="chevron_left" className="text-4xl" />
          </button>
        )}

        {/* Image Container */}
        <div 
          className="w-full h-full md:px-24 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
             <img 
              key={items[currentIndex]}
              src={items[currentIndex]} 
              alt={`Outfit ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 fade-in duration-300"
            />
          </div>
        </div>

        {/* Next Button (Desktop) */}
        {currentIndex < items.length - 1 && (
          <button 
            onClick={nextImage}
            className="hidden md:flex absolute right-8 z-10 w-14 h-14 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/20"
          >
            <MaterialIcon name="chevron_right" className="text-4xl" />
          </button>
        )}
      </div>

      {/* Thumbnails Footer */}
      <div className="flex justify-center items-center gap-3 p-8 overflow-x-auto no-scrollbar">
        {items.map((url, idx) => (
          <button
            key={url}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-brand-pink scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
          >
            <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

export default CombinationGallery;
