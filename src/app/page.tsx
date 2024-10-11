'use client'

import React, { useState } from 'react';
import { Box, Button, Output } from "./modules";
import { calculate_click, downloadLP } from "./scripts";
import text from "./lang";

export default function Home() {
  const [language, setLanguage] = useState('eng');
  const [maxminOption, setMaxminOption] = useState('maximize');

  const tr_hTitle = text(language, 'header_title');
  const tr_hSubtitle = text(language, 'header_subtitle');
  const tr_boxObjTitle = text(language, 'boxObjTitle');
  const tr_boxObjDesc = text(language, "boxObjDesc");
  const tr_boxSubjTitle = text(language, 'boxSubjTitle');
  const tr_boxSubjDesc = text(language, "boxSubjDesc");
  const tr_boxBoundsTitle = text(language, 'boxBoundsTitle');
  const tr_boxBoundsDesc = text(language, "boxBoundsDesc");
  const tr_boxVarsTitle = text(language, 'boxVarsTitle');
  const tr_boxVarsDesc = text(language, "boxVarsDesc");
  const tr_boxOut = text(language, "boxOut");
  const tr_boxExportLP = text(language, "boxExportLP");
  const tr_calc_max = text(language, "maximize");
  const tr_calc_min = text(language, "minimize");
  const tr_calcButton = text(language, "buttonCalc");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const handleMaxMinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxminOption(event.target.value);
  };
    
  return (
    <>
      <header className="header">
        <div className="title">
          <main className="header_box">
            {tr_hTitle}
            <br />
            <span className="header_copyright">
              <i>{tr_hSubtitle}</i>
            </span>
            <br />
            <select id="language_current" value={language} onChange={handleLanguageChange} className="dropdown-custom">
              <option value="ger">Deutsch</option>
              <option value="eng">English</option>
            </select>
          </main>
        </div>
      </header>
      <Box
        title={tr_boxObjTitle}
        placeholder={tr_boxObjDesc}
        id="objective"
      />
      <Box
        title={tr_boxSubjTitle}
        placeholder={tr_boxSubjDesc}
        id="subject"
      />
      <Box
        title={tr_boxBoundsTitle}
        placeholder={tr_boxBoundsDesc}
        id="bounds"
      />
      <Box
        title={tr_boxVarsTitle}
        placeholder={tr_boxVarsDesc}
        id="vars"
      />
      <select id="maxminswitch" value={maxminOption} onChange={handleMaxMinChange} className="dropdown-custom-maxmin">
        <option value="maximize">{tr_calc_max}</option>
        <option value="minimize">{tr_calc_min}</option>
      </select>
      <Button
        title={tr_calcButton}
        className={"button_green"}
        onClickFunc={calculate_click}
      />
      <Button
        title={tr_boxExportLP}
        className={"button"}
        onClickFunc={downloadLP}
      />
      <br />
      <Output
        id="out"
        text={tr_boxOut}
      />
    </>
  );
}
