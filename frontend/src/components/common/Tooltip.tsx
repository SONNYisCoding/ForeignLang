import React from 'react';
import './Tooltip.css';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="uiverse-tooltip-wrapper">
            {children}
            <span className="uiverse-tooltip-content">{content}</span>
        </div>
    );
};
