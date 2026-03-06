import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle';
import React from 'react';

// Mock the framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, className, 'aria-label': ariaLabel, ...props }: React.ComponentProps<'button'>) => (
            <button onClick={onClick} className={className} aria-label={ariaLabel} {...props}>
                {children}
            </button>
        )
    }
}));

// Mock the useTheme hook
const mockToggleTheme = vi.fn();

vi.mock('../../contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light', // default mock return value
        toggleTheme: mockToggleTheme,
    }),
}));

describe('ThemeToggle Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the toggle button with correct aria-label', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle dark mode/i });
        expect(button).toBeInTheDocument();
    });

    it('calls toggleTheme when the button is clicked', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /toggle dark mode/i });

        fireEvent.click(button);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
});
