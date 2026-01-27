import React, { useState, useEffect, useRef } from 'react';
import { Item, ItemType } from '../types';
import { COLOR_MAP } from '../constants';
import CameraPlaceholder from './CameraPlaceholder';
import MaterialIcon from './MaterialIcon';

interface ItemListItemProps {
  item: Item;
  onEdit: (item: Item) => void;
  onUpdate: (item: Item) => void;
}

const ItemListItem: React.FC<ItemListItemProps> = ({ item, onEdit, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleIncrementUsage = () => {
    onUpdate({ ...item, usageCount: item.usageCount + 1 });
  };


  const getTitleFontSize = (name: string, width: number) => {
    // Basic heuristics for font size based on width and name length
    // width is approximately the available space for text
    const availableWidth = width - 120; // estimate space after image and icon
    if (availableWidth <= 0) return 'text-sm';

    const charsPerLine = availableWidth / 8; // rough estimate of pixels per char at text-base
    const totalCapacity = charsPerLine * 2; // 2 lines max

    if (name.length > totalCapacity * 1.5) return 'text-xs';
    if (name.length > totalCapacity) return 'text-sm';
    if (name.length > totalCapacity * 0.7) return 'text-base';
    return 'text-lg';
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    // Prevent toggling if a button or its child element was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={containerRef} className="bg-brand-beige rounded-lg shadow-md overflow-hidden transition-all duration-300 text-brand-text">
      {/* Collapsed View */}
      <div className="flex items-center p-2 cursor-pointer" onClick={handleToggleExpand}>
        {item.photo ? (
          <img src={item.photo} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden">
            <CameraPlaceholder iconSize={48} />
          </div>
        )}
        <div className="flex-grow ml-3 sm:ml-4">
          <div className="flex justify-between items-center capitalize">
            <div className="pr-2">
              <h3 className={`font-bold text-brand-text line-clamp-2 leading-tight ${getTitleFontSize(item.name, containerWidth)}`}>{item.name}</h3>
              {item.isSold && <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full mt-1 inline-block">VERKAUFT</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrementUsage();
              }}
              className="flex items-center space-x-2 text-sm text-brand-text hover:opacity-70 transition-opacity cursor-pointer flex-shrink-0 p-1"
            >
              <MaterialIcon name="favorite" className="text-brand-pink text-xl" fill={true} />
              <span className="font-bold">{item.usageCount}</span>
            </button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex items-center justify-center">
          <MaterialIcon name="expand_more" className={`text-zinc-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded View */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-2 border-t border-zinc-300">
          <div className="space-y-2 text-sm text-brand-text">
            <div className="flex justify-between border-b border-zinc-200 pb-1"><span>Typ:</span> <span className="font-medium">{item.type}</span></div>
            {![ItemType.Klappe, ItemType.Henkel, ItemType.Accessoire].includes(item.type) && <div className="flex justify-between border-b border-zinc-200 pb-1"><span>Form:</span> <span className="font-medium">{item.shape}</span></div>}
            <div className="flex justify-between items-center border-b border-zinc-200 pb-1">
              <span>Farbe:</span>
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap justify-end max-w-[70%] font-medium">
                {item.color.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-zinc-300" style={{ backgroundColor: COLOR_MAP[c] }}></span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            {item.type !== ItemType.Kombination && (
              <>
                <div className="flex justify-between border-b border-zinc-200 pb-1"><span>Originalpreis:</span> <span className="font-medium">€{item.price.toFixed(2)}</span></div>
                {item.purchasePrice && <div className="flex justify-between border-b border-zinc-200 pb-1"><span>Kaufpreis:</span> <span className="font-medium">€{item.purchasePrice.toFixed(2)}</span></div>}
                {item.isSold && item.sellingPrice && (
                  <div className="flex justify-between text-green-600 font-semibold border-b border-green-200 pb-1"><span>Verkaufspreis:</span> <span>€{item.sellingPrice.toFixed(2)}</span></div>
                )}
              </>
            )}
            <div className="flex justify-between border-b border-zinc-200 pb-1"><span>Getragen:</span> <span className="font-medium">{item.usageCount} Mal</span></div>

            {item.notes && (
              <div className="pt-2">
                <p className="font-semibold text-brand-pink mb-1">Notizen:</p>
                <div className="bg-white/40 p-2 rounded-md text-xs">
                  <p className="italic text-brand-text/80">{item.notes}</p>
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 mt-3 border-t border-zinc-300 flex items-center justify-between gap-2">
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

export default ItemListItem;