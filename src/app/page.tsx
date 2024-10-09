'use client'

import { useState } from "react"; // Hook importieren
import { useRouter } from 'next/navigation'; // Router für Navigation verwenden
import { Box, Button, Output } from "./modules";
import { calculate_click, downloadLP, import_click } from "./scripts"

export default function Home() {
  // Zustand für den Toggle-Button
  const [toggleValue, setToggleValue] = useState<'Max' | 'Min'>('Max');
  const [selectedValue, setSelectedValue] = useState<string>(''); // Um den gewählten Wert zu speichern

  // Router-Objekt
  const router = useRouter();

  // Funktion zum Umschalten des Wertes (aber nicht sofort übergeben)
  const handleToggleChange = () => {
    const newValue = toggleValue === 'Max' ? 'Min' : 'Max';
    setToggleValue(newValue);

    // Verstecktes Input-Feld mit neuem Wert aktualisieren
    const directionElement = document.getElementById('direction') as HTMLInputElement;
    if (directionElement) {
      directionElement.value = newValue;
    }
  };

  // Funktion zum Aufrufen des Calculate-Clicks mit dem ausgewählten Wert
  const handleCalculateClick = () => {
    setSelectedValue(toggleValue); // Den aktuellen Wert speichern

    // Den Wert an calculate_click übergeben
    const directionElement = document.getElementById('direction') as HTMLInputElement;
    if (directionElement) {
      calculate_click(directionElement.value);  // Übergibt den Wert "Max" oder "Min"
    }
  };

  // Funktion zum Navigieren zu page2.tsx
  const goToPage2 = () => {
    router.push('./page2'); // Navigiere zu page2.tsx
  };

  return (
    <>
      <header className="header">
        <div className="title">
          <main className="header_box">
            Operations Research Tool
            <br></br>
            <span className="header_copyright">
              <i>by Spaceholder Programming</i>
            </span>
          </main>
        </div>
      </header>

      <Box
        title={"Objective"}
        placeholder={"Insert your objective here. One objective is allowed. Use one line for it (no \"return\"!) Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx + y\n-786433 x1 + 655361 x2"}
        id="objective"/>
      <Box
        title={"Subject"}
        placeholder={"Insert your subject here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\n+1 x + 2 y <= 15\n524321 x14 + 524305 x15 <= 4194303.5"}
        id="subject"/>
      <Box
        title={"Bounds"}
        placeholder={"Insert your bounds here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx >= 0\nx > 0\n0 <= x1 <= 1"}
        id="bounds"/>
      <Box
        title={"Variables"}
        placeholder={"List all your variables. One per line (divide by 'return' button). Allowed symbols are a-z, A-Z.\nExample:\nx\ny"}
        id="vars" />

      {/* Toggle-Button */}
      <Button
        title={toggleValue === 'Max' ? "Maximize" : "Minimize"}
        className={"button"}
        onClickFunc={handleToggleChange} />

      {/* Verstecktes Eingabefeld für den Toggle-Wert */}
      <input type="hidden" id="direction" value={toggleValue} />

      <Button
        title={"Calculate"}
        className={"button_green"}
        onClickFunc={handleCalculateClick} />

      <Button
        title={"Export as LP"}
        className={"button"}
        onClickFunc={downloadLP} />

      <br></br>
      <Output
        id="out"
        text={"Input a problem and an action button to display output..."} />

      {/* Button zum Navigieren zu page2.tsx */}
      <Button
        title={"Go to Page 2"}
        className={"button"}
        onClickFunc={goToPage2} />
    </>
  );
}