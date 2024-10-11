import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../src/app/page';
import { customLog, customLogClear } from '../src/app/scripts';

// Mock customLog and customLogClear
jest.mock('../src/app/scripts', () => ({
    customLog: jest.fn(),
    customLogClear: jest.fn(),
}));

// Mock next/navigation instead of next/router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

// Mock GLPKAPI to avoid issues with undefined LPF_ECOND
jest.mock('../src/solver/glpk.min.js', () => ({
    LPF_ECOND: 2,
}));

test('render home page', () => {
    // Render Home component
    render(<Home />);

    // Check if the heading text "OR-Tool" is present in the document
    const headingElement = screen.getByText(/OR-Tool/i);  // Match text that contains "OR-Tool"
    expect(headingElement).toBeInTheDocument();
});
