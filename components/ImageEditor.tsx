import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import MaterialIcon from './MaterialIcon';
import { getCroppedImg } from '../services/imgUtils';

interface ImageEditorProps {
    image: string;
    onCropComplete: (croppedImage: Blob) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bgColor, setBgColor] = useState('#FFFFFF');

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            if (croppedAreaPixels) {
                setIsProcessing(true);
                // Artificial delay to show processing state
                await new Promise(r => setTimeout(r, 100));
                const croppedImage = await getCroppedImg(image, croppedAreaPixels, bgColor);
                if (croppedImage) {
                    onCropComplete(croppedImage);
                }
            }
        } catch (e) {
            console.error(e);
            alert('Fehler beim Zuschneiden des Bildes.');
            setIsProcessing(false);
        }
    };

    const handleCenter = () => {
        setCrop({ x: 0, y: 0 });
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
            <div className="flex items-center justify-between p-4 bg-zinc-900 text-white">
                <h3 className="text-lg font-semibold">Bild anpassen</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isProcessing}
                    className="p-1 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
                >
                    <MaterialIcon name="close" className="text-2xl" />
                </button>
            </div>

            <div className="relative flex-grow w-full overflow-hidden" style={{ background: bgColor }}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    minZoom={0.5}
                    restrictPosition={false}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropCompleteCallback}
                    style={{
                        containerStyle: { background: bgColor }
                    }}
                />
                {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink mb-4"></div>
                        <p className="text-white font-medium">Wird verarbeitet...</p>
                    </div>
                )}
            </div>

            <div className="p-6 bg-zinc-900 border-t border-zinc-800">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-zinc-400 font-medium px-1">
                            <span>Zoom & Hintergrund</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                value={zoom}
                                min={0.5}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                disabled={isProcessing}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="flex-grow h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-pink disabled:opacity-50"
                            />
                            <div className="flex items-center gap-2 bg-zinc-800 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setBgColor('#FFFFFF')}
                                    disabled={isProcessing}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${bgColor === '#FFFFFF' ? 'border-brand-pink scale-110' : 'border-transparent'}`}
                                    style={{ background: '#FFFFFF' }}
                                    title="Weißer Hintergrund"
                                />
                                <button
                                    type="button"
                                    onClick={() => setBgColor('#EFEBE5')}
                                    disabled={isProcessing}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${bgColor === '#EFEBE5' ? 'border-brand-pink scale-110' : 'border-transparent'}`}
                                    style={{ background: '#EFEBE5' }}
                                    title="Beiger Hintergrund"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleCenter}
                                disabled={isProcessing}
                                className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                title="Bild zentrieren"
                            >
                                <MaterialIcon name="filter_center_focus" className="text-xl" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-4 border border-zinc-700 text-sm font-semibold rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="flex-1 py-2.5 px-4 bg-brand-pink text-sm font-semibold rounded-xl text-brand-text hover:bg-brand-pink-dark transition-colors shadow-lg shadow-brand-pink/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-brand-text/30 border-t-brand-text rounded-full animate-spin"></div>
                                    Speichern...
                                </>
                            ) : (
                                'Speichern'
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-zinc-500 italic">
                        Ziehe das Bild, um den sichtbaren Bereich zu ändern
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
