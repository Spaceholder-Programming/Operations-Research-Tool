import { render, fireEvent, screen } from '@testing-library/react';
import { 
    customLog, 
    customLogClear, 
    getTranslation, 
    isInputValidRegex, 
    isInputFilled, 
    downloadLPFormatting, 
    downloadLP, 
    calculate_click 
} from '../src/app/scripts';
import Home from '../src/app/page'
import text from '../src/app/lang';

// Mocking GLPKAPI and console log
jest.mock('../src/solver/glpk.min.js', () => ({
    LPF_ECOND: 2,
}));

// Mocking console.log
const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});

beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <select id="language_current">
          <option value="eng">English</option>
        </select>
        <textarea id="objective"></textarea>
        <textarea id="subject"></textarea>
        <textarea id="bounds"></textarea>
        <textarea id="vars"></textarea>
        <select id="maxminswitch">
          <option value="maximize">Maximize</option>
          <option value="minimize">Minimize</option>
        </select>
        <div id="out"></div>
      </div>
    `;
    jest.clearAllMocks(); // Clear any previous mocks
});

test('customLog should append message to output box', () => {
    const message = 'Test message';
    customLog(message);
    const outputElement = document.getElementById('out');
    expect(outputElement.innerHTML).toContain(message);
});

test('customLogClear should clear the output box', () => {
    const message = 'Test message';
    customLog(message);
    customLogClear();
    const outputElement = document.getElementById('out');
    expect(outputElement.innerHTML).toBe('');
});

test('getTranslation should return translation based on selected language', () => {
    const result = getTranslation('header_title');
    expect(result).toBe(text('eng', 'header_title')); // Assuming text function provides correct translation
});

test('isInputValidRegex should validate input regex correctly', () => {
    expect(isInputValidRegex("x + y", "+1 x + 2 y <= 15\n+3 x + 1 y <= 20", "x >= 0\ny >= 0", "x\ny")).toBe(true);
    expect(isInputValidRegex("x + y", "+1 x + 2 y <= 15\n+3 x + 1 y <= 20", "x >= 0\ny >= 0", "")).toBe(false); // Invalid objective
});

test('isInputFilled should check for filled inputs', () => {
    expect(isInputFilled('3x + 5y', 'x + y <= 10', 'x <= 5', 'x\ny')).toBe(true);
    expect(isInputFilled('', 'x + y <= 10', 'x <= 5', 'x\ny')).toBe(false); // Objective empty
});

test('downloadLPFormatting should format LP correctly', () => {
    const formattedLP = downloadLPFormatting('3x + 5y', 'x + y <= 10', 'x <= 5');
    expect(formattedLP).toContain('obj: 3x + 5y');
    expect(formattedLP).toContain('Subject To');
    expect(formattedLP).toContain('Bounds');
});

test('calculate_click should display "Calculating" in the output box', () => {
    render(<Home />);

    // Spy on customLog and customLogClear to prevent actual logging and check the calls
    const mockClear = jest.spyOn({ customLogClear }, 'customLogClear').mockImplementation();
    const mockLog = jest.spyOn({ customLog }, 'customLog').mockImplementation();

    // Set valid inputs
    document.getElementById('objective').value = '3x + 5y';
    document.getElementById('subject').value = 'x + y <= 10';
    document.getElementById('bounds').value = 'x <= 5';
    document.getElementById('vars').value = 'x\ny';

    // Simuliere den Button-Klick, der die Berechnung startet
    fireEvent.click(screen.getByText('Calculate'));

    // Check the contents of out box
    const outputElement = document.getElementById('out');
    expect(outputElement.innerHTML).toContain('Calculating');

    // Clear mock
    mockClear.mockRestore();
    mockLog.mockRestore();
});

