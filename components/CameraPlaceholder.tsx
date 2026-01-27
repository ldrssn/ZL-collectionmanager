import React from 'react';
import MaterialIcon from './MaterialIcon';

const CameraPlaceholder: React.FC<{ className?: string; iconSize?: number }> = ({
    className = "w-full h-full",
    iconSize = 92
}) => {
    return (
        <div className={`flex items-center justify-center bg-brand-beige text-brand-pink ${className}`}>
            <MaterialIcon name="photo_camera" size={iconSize} />
        </div>
    );
};

export default CameraPlaceholder;
