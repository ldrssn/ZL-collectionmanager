import React, { useState, useEffect } from 'react';
import { Item, ItemType, ItemShape } from '../types';
import { COLORS, COLOR_MAP } from '../constants';
import { generateUUID } from '../services/utils';
import { uploadImage, deleteImage } from '../services/itemService';
import MaterialIcon from './MaterialIcon';
import ImageEditor from './ImageEditor';

interface ItemFormProps {
  onAddItem: (item: Item) => void;
  onUpdateItem: (item: Item) => void;
  onDeleteItem: (item: Item) => void;
  onClose: () => void;
  initialData?: Item | null;
}

const AddItemForm: React.FC<ItemFormProps> = ({ onAddItem, onUpdateItem, onDeleteItem, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [type, setType] = useState<ItemType>(ItemType.Klappe);
  const [shape, setShape] = useState<ItemShape>(ItemShape.Square);
  const [color, setColor] = useState<string[]>([COLORS[0]]);
  const [price, setPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [usageCount, setUsageCount] = useState('');
  const [isSold, setIsSold] = useState(false);
  const [sellingPrice, setSellingPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const colorDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setIsColorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhoto(initialData.photo);
      setType(initialData.type);
      setShape(initialData.shape);
      setColor(initialData.color);
      setPrice(String(initialData.price));
      setPurchasePrice(initialData.purchasePrice ? String(initialData.purchasePrice) : '');
      setUsageCount(String(initialData.usageCount));
      setIsSold(initialData.isSold);
      setSellingPrice(initialData.sellingPrice ? String(initialData.sellingPrice) : '');
      setNotes(initialData.notes || '');
    } else {
      // Reset form for "add new" mode
      setName('');
      setPhoto(null);
      setType(ItemType.Klappe);
      setShape(ItemShape.Square);
      setColor([COLORS[0]]);
      setPrice('');
      setPurchasePrice('');
      setUsageCount('');
      setIsSold(false);
      setSellingPrice('');
      setNotes('');
    }
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setEditingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    setEditingImage(null);
    const url = await uploadImage(croppedBlob);
    if (url) {
      setPhoto(url);
    } else {
      alert('Fehler beim Hochladen des Bildes.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Bitte geben Sie einen Namen an.');
      return;
    }

    if (isSold && (!sellingPrice || parseFloat(sellingPrice) <= 0)) {
      alert('Bitte geben Sie einen gültigen Verkaufspreis an.');
      return;
    }

    const itemData = {
      name,
      photo: photo || '', // Allow empty string or handle as null contextually, but existing type might require string. 
      type,
      shape,
      color,
      price: parseFloat(price) || 0,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      usageCount: parseInt(usageCount, 10) || 0,
      isSold,
      sellingPrice: isSold ? parseFloat(sellingPrice) : undefined,
      notes,
    };

    if (initialData) {
      // Check if photo has changed and delete old image if necessary
      if (initialData.photo && photo && initialData.photo !== photo) {
        await deleteImage(initialData.photo);
      }

      const updatedItem: Item = {
        ...initialData,
        ...itemData,
      };
      onUpdateItem(updatedItem);
    } else {
      const newItem: Item = {
        id: generateUUID(),
        ...itemData,
      };
      onAddItem(newItem);
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialData) {
      onDeleteItem(initialData);
    }
  };

  const inputBaseClasses = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelBaseClasses}>Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputBaseClasses} required />
      </div>
      <div>
        <label htmlFor="photo" className={labelBaseClasses}>Foto</label>
        <input
          type="file"
          id="photo"
          onChange={handleImageChange}
          accept="image/*"
          disabled={uploading}
          className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 dark:file:bg-zinc-600 file:text-gray-900 dark:file:text-brand-pink-dark hover:file:bg-rose-100 dark:hover:file:bg-zinc-500"
        />
        {uploading && <p className="text-xs text-brand-pink mt-1 animate-pulse">Wird hochgeladen...</p>}
        {photo && (
          <div className="mt-2 relative inline-block group">
            <img src={photo} alt="Vorschau" className="h-24 w-24 object-cover rounded-md" />
            <button
              type="button"
              onClick={() => setEditingImage(photo)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Bild anpassen"
            >
              <MaterialIcon name="crop" className="text-xl" />
            </button>
          </div>
        )}
      </div>

      {editingImage && (
        <ImageEditor
          image={editingImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setEditingImage(null)}
        />
      )}
      <div className={`grid grid-cols-1 ${![ItemType.Henkel, ItemType.Accessoire].includes(type) ? 'md:grid-cols-2' : ''} gap-4`}>
        <div>
          <label htmlFor="type" className={labelBaseClasses}>Kategorie</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value as ItemType)} className={inputBaseClasses}>
            {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {![ItemType.Henkel, ItemType.Accessoire].includes(type) && (
          <div>
            <label htmlFor="shape" className={labelBaseClasses}>Form</label>
            <select id="shape" value={shape} onChange={(e) => setShape(e.target.value as ItemShape)} className={inputBaseClasses}>
              {Object.values(ItemShape).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="color" className={labelBaseClasses}>Farbe(n)</label>
        <div className="relative" ref={colorDropdownRef}>
          <button
            type="button"
            onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
            className="relative w-full bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-brand-pink focus:border-brand-pink sm:text-sm"
          >
            <div className="flex items-center flex-wrap gap-1.5">
              {color.length > 0 ? (
                color.map(c => (
                  <div key={c} className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-zinc-600">
                    <span className="w-3 h-3 rounded-full border border-gray-400 flex-shrink-0" style={{ background: COLOR_MAP[c] }}></span>
                    <span className="text-xs text-gray-700 dark:text-gray-200">{c}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">Farbe wählen...</span>
              )}
            </div>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <MaterialIcon name="unfold_more" className="h-5 w-5 text-gray-400" />
            </span>
          </button>

          {isColorDropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {COLORS.map((c) => {
                const isSelected = color.includes(c);
                return (
                  <li
                    key={c}
                    className={`text-gray-900 dark:text-gray-200 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-brand-pink/10 dark:hover:bg-zinc-600 transition-colors ${isSelected ? 'bg-brand-pink/5' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      let newColors;
                      if (isSelected) {
                        newColors = color.filter(selected => selected !== c);
                      } else {
                        newColors = [...color, c];
                      }
                      // Keep the same order as in COLORS array
                      newColors.sort((a, b) => COLORS.indexOf(a) - COLORS.indexOf(b));
                      setColor(newColors);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full border border-gray-400 flex-shrink-0" style={{ background: COLOR_MAP[c] }}></span>
                      <span className={`ml-3 block truncate ${isSelected ? 'font-semibold text-brand-pink' : 'font-normal'}`}>
                        {c}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-pink">
                        <MaterialIcon name="check" className="h-5 w-5" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {type !== ItemType.Kombination && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className={labelBaseClasses}>Originalpreis (€)</label>
              <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" className={inputBaseClasses} />
            </div>
            <div>
              <label htmlFor="purchasePrice" className={labelBaseClasses}>Kaufpreis (€)</label>
              <input type="number" id="purchasePrice" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} step="0.01" className={inputBaseClasses} />
            </div>
          </div>
        </>
      )}
      <div>
        <label htmlFor="usageCount" className={labelBaseClasses}>Wie oft getragen</label>
        <input type="number" id="usageCount" value={usageCount} onChange={(e) => setUsageCount(e.target.value)} className={inputBaseClasses} />
      </div>
      <div>
        <label htmlFor="notes" className={labelBaseClasses}>Notizen</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputBaseClasses}></textarea>
      </div>
      {type !== ItemType.Kombination && (
        <div className="border-t dark:border-zinc-700 pt-4">
          <div className="flex items-center">
            <input
              id="isSold"
              type="checkbox"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              className="h-4 w-4 text-brand-pink bg-white border-gray-300 rounded focus:ring-brand-pink dark:bg-zinc-700 dark:border-zinc-600"
            />
            <label htmlFor="isSold" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              Als verkauft markieren
            </label>
          </div>
          {isSold && (
            <div className="mt-4">
              <label htmlFor="sellingPrice" className={labelBaseClasses}>Verkaufspreis (€)</label>
              <input type="number" id="sellingPrice" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} step="0.01" className={inputBaseClasses} required />
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between items-center pt-4">
        <div>
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Löschen
            </button>
          )}
        </div>
        <div className="flex items-center">
          <button type="button" onClick={onClose} className="bg-white dark:bg-zinc-600 py-2 px-4 border border-gray-300 dark:border-zinc-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-500 focus:outline-none mr-3">Abbrechen</button>
          <button type="submit" disabled={uploading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none disabled:opacity-50">
            {initialData ? 'Änderungen speichern' : 'Teil hinzufügen'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddItemForm;