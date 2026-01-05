import React from 'react';

interface MaterialIconProps {
    name: string;
    className?: string;
    fill?: boolean;
    size?: number | string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ name, className = '', fill = false, size }) => {
    return (
        <span
            className={`material-symbols-rounded align-middle ${className}`}
            style={{
                fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                userSelect: 'none',
                fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined
            }}
        >
            {name}
        </span>
    );
};

export default MaterialIcon;
