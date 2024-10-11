import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from "../src/app/page";
import { customLog, customLogClear } from '../src/app/scripts';
import { useRouter } from 'next/router';


jest.mock('../src/app/scripts', () => ({
    customLog: jest.fn(),
    customLogClear: jest.fn(),
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(), 
    }),
}));

jest.mock('../src/solver/glpk.min.js', () => ({
    LPF_ECOND: 2,
}));

test('render home page', () => {
    // render website
    render(<Home />);

    // check if text is in document
    const headingElement = screen.getByText(/OR-Tool/i);  // text search in document
    expect(headingElement).toBeInTheDocument();
});
