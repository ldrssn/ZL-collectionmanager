import React, { useState, useMemo } from 'react';
import { Item, ItemType, ItemShape } from '../types';
import { generateUUID } from '../services/utils';
import { getPlaceholder, COLOR_MAP } from '../constants';
import { uploadImage } from '../services/itemService';
import CameraPlaceholder from './CameraPlaceholder';
import MaterialIcon from './MaterialIcon';

interface KombiBuilderProps {
    items: Item[];
    onAddKombination: (item: Item) => void;
    onClose: () => void;
}

const SelectionCard: React.FC<{ item: Item; isSelected: boolean; onClick: () => void }> = ({ item, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 transform ${isSelected ? 'border-brand-pink scale-105 shadow-lg' : 'border-transparent hover:shadow-md hover:-translate-y-1'}`}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
    >
        {item.photo ? (
            <img src={item.photo} alt={item.name} className="w-full aspect-square object-cover" />
        ) : (
            <div className="w-full aspect-square">
                <CameraPlaceholder />
            </div>
        )}
        <p className="text-center p-1 text-xs sm:p-2 sm:text-sm font-semibold truncate bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200">{item.name}</p>
    </div>
);

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number; }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (
                <div key={step} className="flex items-center">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-base transition-colors ${isActive ? 'bg-brand-pink text-brand-text' :
                        isCompleted ? 'bg-green-500 text-white' :
                            'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400'
                        }`}>
                        {isCompleted ? <MaterialIcon name="check" className="text-sm sm:text-lg" /> : step}
                    </div>
                    {step < totalSteps && <div className="w-4 sm:w-8 h-px bg-gray-200 dark:bg-zinc-600 mx-1 sm:mx-2"></div>}
                </div>
            );
        })}
    </div>
);

const KombiBuilder: React.FC<KombiBuilderProps> = ({ items, onAddKombination, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedBody, setSelectedBody] = useState<Item | null>(null);
    const [selectedFlap, setSelectedFlap] = useState<Item | null>(null);
    const [selectedHandle, setSelectedHandle] = useState<Item | null>(null);
    const [selectedAccessoire, setSelectedAccessoire] = useState<Item | null>(null);
    const [kombinationName, setKombinationName] = useState('');
    const [kombinationPhoto, setKombinationPhoto] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

    const availableBodies = useMemo(() => items.filter(i => i.type === ItemType.Körper && !i.isSold), [items]);
    const availableFlaps = useMemo(() => {
        if (!selectedBody) return [];
        return items.filter(i => i.type === ItemType.Klappe && !i.isSold && i.shape === selectedBody.shape);
    }, [items, selectedBody]);
    const availableHandles = useMemo(() => items.filter(i => i.type === ItemType.Henkel && !i.isSold), [items]);
    const availableAccessoires = useMemo(() => items.filter(i => i.type === ItemType.Accessoire && !i.isSold), [items]);

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const newImages: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const url = await uploadImage(e.target.files[i]);
                if (url) newImages.push(url);
            }
            
            if (newImages.length > 0) {
                setGallery(prev => [...prev, ...newImages]);
                if (!kombinationPhoto) {
                    setKombinationPhoto(newImages[0]);
                }
            } else {
                alert('Fehler beim Hochladen der Bilder.');
            }
            setUploading(false);
            // Reset input values
            e.target.value = '';
        }
    };

    const removeGalleryImage = (url: string) => {
        setGallery(prev => {
            const filtered = prev.filter(img => img !== url);
            if (kombinationPhoto === url) {
                setKombinationPhoto(filtered.length > 0 ? filtered[0] : null);
            }
            return filtered;
        });
    };

    const setAsCover = (url: string) => {
        const oldCover = kombinationPhoto;
        setKombinationPhoto(url);
        if (oldCover) {
            setGallery(prev => {
                const withoutNewCover = prev.filter(img => img !== url);
                if (!withoutNewCover.includes(oldCover)) {
                    return [...withoutNewCover, oldCover];
                }
                return withoutNewCover;
            });
        } else {
            setGallery(prev => prev.filter(img => img !== url));
        }
        setSelectedGalleryImage(null);
    };

    const handleDeleteImage = (url: string) => {
        setGallery(prev => prev.filter(img => img !== url));
        setSelectedGalleryImage(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kombinationName.trim()) {
            alert("Bitte geben Sie der Kombination einen Namen.");
            return;
        }
        if (!selectedBody || !selectedFlap) return;

        const parts = [
            { item: selectedBody, label: 'Körper' },
            { item: selectedFlap, label: 'Klappe' },
            selectedHandle && { item: selectedHandle, label: 'Henkel' },
            selectedAccessoire && { item: selectedAccessoire, label: 'Accessoire' }
        ].filter(Boolean) as { item: Item; label: string }[];

        const notes = `Kombination aus:\n${parts.map(p => `- ${p.item.name} (${p.label})`).join('\n')}`;
        const combinedColors = [...new Set(parts.flatMap(p => p.item.color))];
        const finalPhoto = kombinationPhoto || '';

        const newKombination: Item = {
            id: generateUUID(),
            name: kombinationName.trim(),
            photo: finalPhoto,
            id: generateUUID(),
            name: kombinationName.trim(),
            photo: finalPhoto,
            type: ItemType.Kombination,
            shape: selectedBody.shape,
            color: combinedColors,
            price: 0,
            purchasePrice: 0,
            usageCount: 0,
            isSold: false,
            notes,
            gallery: gallery.filter(img => img !== finalPhoto),
        };

        onAddKombination(newKombination);
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 1: Wähle einen Körper</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableBodies.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedBody?.id === item.id} onClick={() => setSelectedBody(item)} />)}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 2: Wähle eine passende Klappe ({selectedBody?.shape})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableFlaps.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedFlap?.id === item.id} onClick={() => setSelectedFlap(item)} />)}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 3: Wähle einen Henkel</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableHandles.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedHandle?.id === item.id} onClick={() => setSelectedHandle(item)} />)}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 4: Wähle ein Accessoire (optional)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 p-2">
                            {availableAccessoires.map(item => <SelectionCard key={item.id} item={item} isSelected={selectedAccessoire?.id === item.id} onClick={() => setSelectedAccessoire(item)} />)}
                        </div>
                    </div>
                );
            case 5:
                const selectedItems = [
                    { item: selectedBody, label: 'Körper' },
                    { item: selectedFlap, label: 'Klappe' },
                    { item: selectedHandle, label: 'Henkel' },
                    { item: selectedAccessoire, label: 'Accessoire' }
                ].filter(p => p.item);

                return (
                    <>
                        <div>
                            <h3 className="font-semibold text-center mb-4 text-gray-700 dark:text-gray-300">Schritt 5: Kombination benennen & speichern</h3>
                            <div className={`grid ${selectedItems.length > 3 ? 'grid-cols-4' : 'grid-cols-3'} gap-2 mb-4 p-2 bg-gray-50 dark:bg-zinc-900/50 rounded-lg`}>
                                {selectedItems.map(({ item, label }) => item && (
                                    <div key={item.id}>
                                        {item.photo ? (
                                            <img src={item.photo} alt={item.name} className="rounded-lg aspect-square object-cover" />
                                        ) : (
                                            <div className="rounded-lg aspect-square overflow-hidden">
                                                <CameraPlaceholder />
                                            </div>
                                        )}
                                        <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate">{item.name}</p>
                                        <p className="text-[10px] text-center text-gray-400 uppercase">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label htmlFor="kombi-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name der Kombination</label>
                                    <input type="text" id="kombi-name" value={kombinationName} onChange={(e) => setKombinationName(e.target.value)} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-pink focus:border-brand-pink sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Galerie & Fotos</label>
                                    <div className="mt-1 flex flex-wrap gap-2 mb-3">
                                        {gallery.map((url, idx) => (
                                            <div key={url} className="relative group">
                                                <img 
                                                    src={url} 
                                                    alt={`Gallery ${idx}`} 
                                                    onClick={() => setSelectedGalleryImage(url)}
                                                    className={`h-20 w-20 object-cover rounded-md border-2 border-transparent hover:border-brand-pink cursor-pointer transition-all`} 
                                                />
                                            </div>
                                        ))}
                                        {kombinationPhoto && (
                                            <div className="relative">
                                                <img 
                                                    src={kombinationPhoto} 
                                                    alt="Cover" 
                                                    onClick={() => setSelectedGalleryImage(kombinationPhoto)}
                                                    className="h-20 w-20 object-cover rounded-md border-2 border-brand-pink cursor-pointer shadow-md" 
                                                />
                                                <div className="absolute top-0 right-0 p-0.5 bg-brand-pink text-brand-text rounded-bl-md rounded-tr-md">
                                                    <MaterialIcon name="check" className="text-[10px]" />
                                                </div>
                                                <span className="absolute -bottom-4 left-0 right-0 text-center text-[9px] font-bold text-brand-pink uppercase tracking-tighter">Cover</span>
                                            </div>
                                        )}
                                        <label className="h-20 w-20 flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-zinc-600 hover:border-brand-pink cursor-pointer transition-colors bg-white dark:bg-zinc-700">
                                            <MaterialIcon name="add_a_photo" className="text-gray-400" />
                                            <span className="text-[10px] text-gray-400 mt-1">Neu</span>
                                            <input
                                                type="file"
                                                onChange={handlePhotoChange}
                                                accept="image/*"
                                                multiple
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {uploading && <p className="text-xs text-brand-pink mt-1 animate-pulse mb-3">Bilder werden hochgeladen...</p>}
                                </div>
                            </form>
                        </div>

                        {selectedGalleryImage && (
                            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedGalleryImage(null)}>
                                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                                    <div className="aspect-square w-full bg-gray-100">
                                        <img src={selectedGalleryImage} alt="Selected" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {selectedGalleryImage !== kombinationPhoto && (
                                            <button 
                                                onClick={() => setAsCover(selectedGalleryImage)}
                                                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-pink text-brand-text rounded-xl font-bold hover:bg-brand-pink-dark transition-colors"
                                            >
                                                <MaterialIcon name="photo_camera" />
                                                Als Cover festlegen
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteImage(selectedGalleryImage)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <MaterialIcon name="delete" />
                                            Löschen
                                        </button>
                                        <button 
                                            onClick={() => setSelectedGalleryImage(null)}
                                            className="w-full py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                                        >
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                );
            default: return null;
        }
    };

    const isNextDisabled = () => {
        if (currentStep === 1 && !selectedBody) return true;
        if (currentStep === 2 && !selectedFlap) return true;
        return false;
    };

    const handleSkip = () => {
        if (currentStep === 3) setSelectedHandle(null);
        if (currentStep === 4) setSelectedAccessoire(null);
        handleNext();
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 pt-4">
                <StepIndicator currentStep={currentStep} totalSteps={5} />
            </div>
            <div className="flex-grow overflow-y-auto py-4">
                {renderStepContent()}
            </div>
            <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t dark:border-zinc-700">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="bg-white dark:bg-zinc-600 py-2 px-4 border border-gray-300 dark:border-zinc-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Zurück
                    </button>
                    {(currentStep === 3 || currentStep === 4) && (
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="bg-white dark:bg-zinc-600 py-2 px-4 border border-gray-300 dark:border-zinc-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark"
                        >
                            Überspringen
                        </button>
                    )}
                </div>
                {currentStep < 5 ? (
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isNextDisabled()}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-text bg-brand-pink hover:bg-brand-pink-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-pink-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Weiter
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={uploading}
                        onClick={handleSave}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        Kombination speichern
                    </button>
                )}
            </div>
        </div>
    );
};

export default KombiBuilder;
