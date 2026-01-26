import React from 'react';

// Formats the message: handles bold (**text**) and bullet points (- or *)
export const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    const formatLine = (line: string, key: string | number) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={`${key}-${index}`} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            currentList.push(
                <li key={index} className="ml-4 list-disc mb-1">
                    {formatLine(trimmedLine.substring(2), index)}
                </li>
            );
        } else {
            if (currentList.length > 0) {
                result.push(<ul key={`list-${index}`} className="mb-4">{currentList}</ul>);
                currentList = [];
            }
            if (trimmedLine === '') {
                result.push(<div key={index} className="h-2" />);
            } else {
                result.push(<p key={index} className="mb-2 text-sm md:text-base">{formatLine(line, index)}</p>);
            }
        }
    });

    if (currentList.length > 0) {
        result.push(<ul key="final-list" className="mb-4">{currentList}</ul>);
    }

    return result;
};
