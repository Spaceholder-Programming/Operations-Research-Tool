'use client'

import { useState } from 'react';

export default function GMPLFileEditor() {
  const [fileContent, setFileContent] = useState<string>('');
  const [parameters, setParameters] = useState<{ [key: string]: any }>({});
  const [equations, setEquations] = useState<string[]>([]); // Gleichungen

  // Funktion zum Verarbeiten des Datei-Uploads
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);

      // Parsen des Inhalts, um Parameter und Gleichungen zu extrahieren
      const parsedParams = parseGMPL(content);
      const parsedEquations = extractEquations(content); // Gleichungen extrahieren
      setParameters(parsedParams);
      setEquations(parsedEquations); // Setze die extrahierten Gleichungen
    };
    reader.readAsText(file);
  };

  // Funktion zum Parsen von Parametern aus der GMPL-Datei
  const parseGMPL = (content: string): { [key: string]: any } => {
    const paramRegex = /param\s+(\w+)\s*:=\s*(.+?);/gs; // Erkennung von Parametern
    const setRegex = /set\s+(\w+)\s*:=\s*(.+?);/gs; // Erkennung von Sets

    const params: { [key: string]: any } = {};
    let match;

    // Parsen der Sets
    while ((match = setRegex.exec(content)) !== null) {
      const paramName = match[1];
      const paramValue = match[2].trim();
      params[paramName] = paramValue;
    }

    // Parsen der Parameter
    while ((match = paramRegex.exec(content)) !== null) {
      const paramName = match[1];
      const paramValue = match[2].trim();
      params[paramName] = paramValue;
    }

    return params;
  };

// Funktion zum Extrahieren von Gleichungen
const extractEquations = (content: string): string[] => {
  const equationRegex = /s\.t\.\s*([^;]+);/gs; // Alle s.t. Bedingungen finden
  const equations: string[] = [];
  let match;
  while ((match = equationRegex.exec(content)) !== null) {
    equations.push(match[0]); // Die ganze Gleichung hinzufügen
  }
  return equations;
};

  // Funktion zum Bearbeiten eines Parameters
  const handleParameterChange = (param: string, newValue: string) => {
    setParameters((prev) => ({
      ...prev,
      [param]: newValue,
    }));
  };



  return (
    <div style={styles.container}>
      <h1 style={styles.header}>GMPL File Editor</h1>

      {/* Datei hochladen */}
      <input type="file" accept=".mod,.dat,.txt,.gmpl" style={styles.fileInput} onChange={handleFileUpload} />

      {/* Parameter anzeigen */}
      {Object.entries(parameters).length > 0 && (
        <div style={styles.parameterGroup}>
          <h2 style={styles.subHeader}>Edit Parameters</h2>
          {Object.entries(parameters).map(([param, value]) => (
            <div key={param} style={styles.parameterSet}>
              <label style={styles.label}>{param}:</label>
              <input
                style={styles.input}
                type="text"
                value={value}
                onChange={(e) => handleParameterChange(param, e.target.value)}
              />
            </div>
          ))}

          <div style={styles.buttonContainer}>
            <button style={styles.button}>
              Calculate
            </button>
          </div>
        </div>
      )}

      {/* Gleichungen anzeigen */}
      {equations.length > 0 && (
        <div style={styles.equationBox}>
          <h2 style={styles.subHeader}>Gleichungen</h2>
          {equations.map((equation, index) => (
            <pre key={index} style={styles.pre}>{equation}</pre>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '20px',
    padding: '20px',
    backgroundColor: '#2a2a2a',
    borderRadius: '10px',
    border: '1px solid #8d8d8d',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  header: {
    fontSize: '24px',
    color: '#ffffff',
    textAlign: 'center' as 'center',
    marginBottom: '20px',
  },
  fileInput: {
    marginBottom: '20px',
  },
  parameterGroup: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    marginBottom: '20px',
  },
  parameterSet: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gap: '10px',
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  label: {
    fontWeight: 'bold' as 'bold',
    color: '#ededed',
    alignSelf: 'center' as 'center',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #8d8d8d',
    backgroundColor: '#202020',
    color: '#ffffff',
    borderRadius: '5px',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end' as 'flex-end',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  equationBox: {
    backgroundColor: '#474747',
    color: '#ffffff',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '5px',
    fontFamily: "'Courier New', Courier, monospace",
    whiteSpace: 'pre-line' as 'pre-line',
  },
  pre: {
    margin: '0',
  },
  subHeader: {
    color: '#ffffff',
    marginBottom: '10px',
  },
};