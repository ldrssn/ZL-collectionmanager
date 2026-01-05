import React, { useState } from 'react';
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

  const handleIncrementUsage = () => {
    onUpdate({ ...item, usageCount: item.usageCount + 1 });
  };

  const costBasis = item.purchasePrice ?? item.price;
  const costPerWear = item.usageCount > 0 ? (costBasis / item.usageCount).toFixed(2) : costBasis.toFixed(2);

  const handleToggleExpand = (e: React.MouseEvent) => {
    // Prevent toggling if a button or its child element was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
      {/* Collapsed View */}
      <div className="flex items-center p-2 sm:p-4 cursor-pointer" onClick={handleToggleExpand}>
        {item.photo ? (
          <img src={item.photo} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden">
            <CameraPlaceholder iconSize={48} />
          </div>
        )}
        <div className="flex-grow ml-3 sm:ml-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{item.name}</h3>
              {item.isSold && <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/50 dark:text-red-400 px-2 py-0.5 rounded-full">VERKAUFT</span>}
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 text-sm bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
              <MaterialIcon name="favorite" className="text-brand-pink text-base" fill={true} />
              <span>{item.usageCount}</span>
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex items-center justify-center">
          <MaterialIcon name="expand_more" className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded View */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="px-2 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-gray-200 dark:border-zinc-700">
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between"><span>Typ:</span> <span>{item.type}</span></div>
            {![ItemType.Henkel, ItemType.Accessoire].includes(item.type) && <div className="flex justify-between"><span>Form:</span> <span>{item.shape}</span></div>}
            <div className="flex justify-between items-center">
              <span>Farbe:</span>
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap justify-end max-w-[70%]">
                {item.color.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: COLOR_MAP[c] }}></span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            {item.type !== ItemType.Kombination && (
              <>
                <div className="flex justify-between"><span>Originalpreis:</span> <span>€{item.price.toFixed(2)}</span></div>
                {item.purchasePrice && <div className="flex justify-between"><span>Kaufpreis:</span> <span>€{item.purchasePrice.toFixed(2)}</span></div>}
                {item.isSold && item.sellingPrice && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold"><span>Verkaufspreis:</span> <span>€{item.sellingPrice.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between"><span>Kosten/Tragen:</span> <span>€{costPerWear}</span></div>
              </>
            )}
            <div className="flex justify-between"><span>Getragen:</span> <span>{item.usageCount} Mal</span></div>

            {item.notes && (
              <div className="pt-2">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Notizen:</p>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 p-2 rounded-md text-xs"><em>{item.notes}</em></p>
              </div>
            )}
          </div>
          <div className="pt-4 mt-3 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between gap-2">
            <button onClick={() => onEdit(item)} className="flex-grow h-10 px-3 bg-gray-200 dark:bg-zinc-600 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-500 transition-colors">Bearbeiten</button>
            <button onClick={handleIncrementUsage} className="flex-shrink-0 w-10 h-10 bg-brand-pink text-brand-text rounded-lg hover:bg-brand-pink-dark transition-colors flex items-center justify-center">
              <MaterialIcon name="favorite" className="text-xl" fill={true} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemListItem;