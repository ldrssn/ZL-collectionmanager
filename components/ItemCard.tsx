import React, { useState, useMemo } from 'react';
import { Item, ItemType } from '../types';
import { COLOR_MAP } from '../constants';
import CameraPlaceholder from './CameraPlaceholder';
import MaterialIcon from './MaterialIcon';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onUpdate: (item: Item) => void;
  activeColorFilter: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onUpdate, activeColorFilter }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flipping if a button or its child element was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleIncrementUsage = () => {
    onUpdate({ ...item, usageCount: item.usageCount + 1 });
  };


  const getTitleFontSize = (name: string) => {
    if (name.length > 60) return 'text-xs';
    if (name.length > 40) return 'text-sm';
    if (name.length > 25) return 'text-base';
    return 'text-lg';
  };

  return (
    <div className="w-full max-w-[280px] h-auto [perspective:1000px] group mx-auto">
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* FRONT FACE */}
        <div
          className="relative w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden bg-brand-beige shadow-lg cursor-pointer flex flex-col"
          onClick={handleFlip}
        >
          {/* Top Bar */}
          <div className="bg-brand-beige h-12 flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center">
              {item.type === ItemType.Kombination && (
                <MaterialIcon name="auto_awesome_motion" className="text-xl text-brand-text" />
              )}
            </div>
            <button
              onClick={handleIncrementUsage}
              className="flex items-center space-x-2 hover:opacity-70 transition-opacity cursor-pointer p-1"
            >
              <MaterialIcon name="favorite" className="text-xl text-brand-pink" fill={true} />
              <span className="text-sm font-bold text-brand-text">{item.usageCount}</span>
            </button>
          </div>

          {/* Image Container (Square) */}
          <div className="relative aspect-square w-full overflow-hidden bg-brand-beige">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <CameraPlaceholder />
            )}
            {item.isSold && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">VERKAUFT</div>
            )}
          </div>

          <div className="bg-brand-beige px-4 flex-shrink-0 flex items-center h-[92px]">
            <h3 className={`text-brand-text font-bold leading-tight line-clamp-2 w-full text-center ${getTitleFontSize(item.name)}`}>
              {item.name}
            </h3>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-brand-beige text-brand-text [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col p-4"
          onClick={handleFlip}
        >
          <div className="flex-grow overflow-y-auto pr-2 space-y-2 text-sm">
            <div className="h-[60px] flex items-center justify-center mb-2">
              <h3 className={`font-bold text-brand-text text-center line-clamp-2 ${getTitleFontSize(item.name)}`}>
                {item.name}
              </h3>
            </div>
            <div className="flex justify-between border-b border-zinc-300 pb-1"><span>Typ:</span> <span className="font-medium">{item.type}</span></div>
            {![ItemType.Henkel, ItemType.Accessoire].includes(item.type) && <div className="flex justify-between border-b border-zinc-300 pb-1"><span>Form:</span> <span className="font-medium">{item.shape}</span></div>}
            <div className="flex justify-between items-start border-b border-zinc-300 pb-1">
              <span>Farbe:</span>
              <div className="flex flex-col items-end gap-1 max-w-[60%] text-right font-medium">
                {item.color.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-zinc-400 flex-shrink-0" style={{ background: COLOR_MAP[c] }}></span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            {item.type !== ItemType.Kombination && (
              <>
                <div className="flex justify-between border-b border-zinc-300 pb-1"><span>Originalpreis:</span> <span className="font-medium">€{item.price.toFixed(2)}</span></div>
                {item.purchasePrice && <div className="flex justify-between border-b border-zinc-300 pb-1"><span>Kaufpreis:</span> <span className="font-medium">€{item.purchasePrice.toFixed(2)}</span></div>}
                {item.isSold && item.sellingPrice && (
                  <div className="flex justify-between border-b border-green-500 text-green-600 pb-1 font-semibold"><span>Verkaufspreis:</span> <span>€{item.sellingPrice.toFixed(2)}</span></div>
                )}
              </>
            )}
            <div className="flex justify-between border-b border-zinc-300 pb-1"><span>Getragen:</span> <span className="font-medium">{item.usageCount} Mal</span></div>

            {item.notes && (
              <div className="pt-2">
                <p className="font-semibold text-brand-pink mb-1">Notizen:</p>
                <div className="bg-white/40 p-2 rounded-md text-xs">
                  <p className="italic text-brand-text/80">{item.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 pt-3 mt-auto border-t border-zinc-300 flex items-center justify-between gap-2">
            <button onClick={() => onEdit(item)} className="flex-grow h-10 px-3 bg-white/60 text-brand-text text-xs font-semibold rounded-lg hover:bg-white/80 transition-colors border border-zinc-200">Bearbeiten</button>
            <button onClick={handleIncrementUsage} className="flex-shrink-0 w-10 h-10 bg-brand-pink text-brand-text rounded-lg hover:bg-brand-pink-dark transition-colors flex items-center justify-center">
              <MaterialIcon name="heart_plus" className="text-xl" fill={false} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;