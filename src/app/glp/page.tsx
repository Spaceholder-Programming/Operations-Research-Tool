'use client';

import { useRouter } from 'next/navigation'; 
import React, { useState, useContext } from 'react';
import text from "../lang";
import { LanguageContext } from '../context/LanguageContext';


const GlpPage = () => {
  const router = useRouter(); 

  const { language, setLanguage } = useContext(LanguageContext);
  const [model, setModel] = useState('gen');

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
  const tr_boxExportMPS = text(language, "boxExportMPS");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const changeModel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = event.target.value;
    setModel(selectedModel);

    if (selectedModel === 'spec') {
      router.push('/'); 
    }
  };

  return (
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
            <select id="language_current" value={model} onChange={changeModel} className="dropdown-custom">
              <option value="gen">General Problems</option>
              <option value="spec">Specific Problems</option>
            </select>
          </main>
        </div>
      </header>
  );
};

export default GlpPage;