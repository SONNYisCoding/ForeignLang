import React, { createContext, useContext, useState, useCallback } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'sidebar-collapsed';

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Default to collapsed (true) on first visit
        return saved === null ? true : saved === 'true';
    });

    const toggleSidebar = useCallback(() => {
        setIsCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
