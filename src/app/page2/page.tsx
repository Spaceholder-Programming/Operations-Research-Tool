'use client'

import { useState } from 'react';
import * as GLPKAPI from "../../solver/glpk.min.js"

export default function GMPLFileEditor() {
  const [fileContent, setFileContent] = useState<string>(''); // State für den Dateiinhalt
  const [parameters, setParameters] = useState<{ [key: string]: any }>({});
  const [equations, setEquations] = useState<string[]>([]); // Gleichungen

  const addMessage = (message: string) => {
    const msgZone = document.getElementById("msgZone");
    if (msgZone) {
      msgZone.innerHTML += `<div>${message}</div>`;
    }
  };

  // Funktion zum Verarbeiten des Datei-Uploads
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      addMessage("Datei wurde erfolgreich hochgeladen und gelesen.");

      // Parsen des Inhalts, um Parameter und Gleichungen zu extrahieren
      const parsedParams = parseGMPL(content);
      const parsedEquations = extractEquations(content); // Gleichungen extrahieren
      setParameters(parsedParams);
      setEquations(parsedEquations); // Setze die extrahierten Gleichungen
      addMessage("Datei wurde erfolgreich geparst.");
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

  const solve = () => {
    addMessage("Starte das Lösen des Modells...");

    var model = fileContent;
    var lp = GLPKAPI.glp_create_prob();
    var tran = GLPKAPI.glp_mpl_alloc_wksp();
    GLPKAPI._glp_mpl_init_rand(tran, 1);

    try {
      GLPKAPI.glp_mpl_read_model_from_string(tran, "model", model, 0);
      GLPKAPI.glp_mpl_generate(tran, null, function (data) {});
      addMessage("Modell erfolgreich in das Solver-Format umgewandelt.");

      GLPKAPI.glp_mpl_build_prob(tran, lp);
      var smcp = new GLPKAPI.SMCP({ presolve: GLPKAPI.GLP_ON });
      GLPKAPI.glp_simplex(lp, smcp);

      var iocp = new GLPKAPI.IOCP({ presolve: GLPKAPI.GLP_ON });
      GLPKAPI.glp_intopt(lp, iocp);
      GLPKAPI.glp_mpl_postsolve(tran, lp, GLPKAPI.GLP_MIP);

      addMessage("Lösen des Modells abgeschlossen.");

      var status;
      switch (GLPKAPI.glp_mip_status(lp)) {
        case GLPKAPI.GLP_OPT:
          status = "OPTIMAL";
          break;
        case GLPKAPI.GLP_UNDEF:
          status = "UNDEFINED SOLUTION";
          break;
        case GLPKAPI.GLP_INFEAS:
          status = "INFEASIBLE SOLUTION";
          break;
        case GLPKAPI.GLP_NOFEAS:
          status = "NO FEASIBLE SOLUTION";
          break;
        case GLPKAPI.GLP_FEAS:
          status = "FEASIBLE SOLUTION";
          break;
        case GLPKAPI.GLP_UNBND:
          status = "UNBOUNDED SOLUTION";
          break;
      }

      addMessage(`Lösungsstatus: ${status}`);

      var variables = "";
      for (var i = 1; i <= GLPKAPI.glp_get_num_cols(lp); i++) {
        variables += GLPKAPI.glp_get_col_name(lp, i) + " = " + GLPKAPI.glp_mip_col_val(lp, i) + "<br/>";
      }
      addMessage("Ergebnisse der Variablen:");
      addMessage(variables);

    } catch (err) {
      addMessage("<div class='alert alert-danger'>" + err.toString() + "</div>");
      console.log(err);
    }
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
            <button style={styles.button} onClick={solve}>
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

      {fileContent && (
        <div style={styles.fileContentBox}>
          <h2 style={styles.subHeader}>Dateiinhalt</h2>
          <pre style={styles.pre}>{fileContent}</pre>
        </div>
      )}

      <div id="msgZone" style={styles.msgZone}></div>
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
  fileContentBox: {
    backgroundColor: '#3c3c3c',
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
  msgZone: {
    marginTop: '20px',
    color: '#ffcc00',
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '5px',
  },
};