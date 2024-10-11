'use client'

import React, { useState } from 'react';
import { Box, Button, Output } from "./modules";
import { calculate_clickMaximize, calculate_clickMinimize, downloadLP, downloadMPS, import_click } from "./scripts"
import text from "./lang"

export default function Home() {
  const [language, setLanguage] = useState('eng');
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
  const tr_boxExoprtMPS = text(language, "boxExportMPS");
  const tr_calc_max = text(language, "maximize");
  const tr_calc_min = text(language, "minimize");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <>
      <header className="header">
        <div className="title">
          <main className="header_box">
            {tr_hTitle}
            <br></br>
            <span className="header_copyright">
              <i>{tr_hSubtitle}</i>
            </span><br></br>
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
        id="objective" />
      <Box
        title={tr_boxSubjTitle}
        placeholder={tr_boxSubjDesc}
        id="subject" />
      <Box
        title={tr_boxBoundsTitle}
        placeholder={tr_boxBoundsDesc}
        id="bounds" />
      <Box
        title={tr_boxVarsTitle}
        placeholder={tr_boxVarsDesc}
        id="vars" />
      <Button
        title={tr_calc_max}
        className={"button_green"}
        onClickFunc={calculate_clickMaximize} />
      <Button
        title={tr_calc_min}
        className={"button_green"}
        onClickFunc={calculate_clickMinimize} />
      <Button
        title={tr_boxExportLP}
        className={"button"}
        onClickFunc={downloadLP} />
      <Button
        title={tr_boxExoprtMPS}
        className={"button"}
        onClickFunc={downloadMPS} />
      <br></br>
      <Output
        id="out"
        text={tr_boxOut} />
    </>
  );
}
