'use client'

import { useState, useRef, useEffect } from 'react';
import * as GLPKAPI from "../../solver/glpk.min.js"

export default function GMPLFileEditor() {
  const [fileContent, setFileContent] = useState<string>(''); // State for file content
  const [parameters, setParameters] = useState<{ [key: string]: any }>({});
  const [equations, setEquations] = useState<string[]>([]); // Equations
  const [showFileContent, setShowFileContent] = useState(false); // Toggle file content display
  const [isLoading, setIsLoading] = useState(false); // Loading animation
  const [solverTime, setSolverTime] = useState<string>(''); // Solver time
  const [showPopup, setShowPopup] = useState(false); // Show result popup
  const [resultContent, setResultContent] = useState<string>(''); // Popup content
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]); // Syntax errors
  const [showErrorPopup, setShowErrorPopup] = useState(false); // Syntax error notification
  const solverTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout reference
  const solverAbortController = useRef<AbortController | null>(null); // Abort controller
  useEffect(() => {
    // Show error popup if there are syntax errors
    if (syntaxErrors.length > 0) {
      setShowErrorPopup(true);
    }
  }, [syntaxErrors]);

  const addMessage = (message: string) => {
    const msgZone = document.getElementById("msgZone");
    if (msgZone) {
      msgZone.innerHTML += `<div>${message}</div>`;
    }
  };

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      addMessage("File successfully uploaded and read.");
      

      // Parse content to extract parameters and equations
      const parsedParams = parseGMPL(content);
      const parsedEquations = extractEquations(content); // Extract equations
      setParameters(parsedParams);
      setEquations(parsedEquations); // Set extracted equations
      addMessage("File successfully parsed.");

      // Perform syntax check
      const errors = checkSyntax(content);
      setSyntaxErrors(errors);
    };
    reader.readAsText(file);
  };

  // Function to parse parameters from GMPL file
  const parseGMPL = (content: string): { [key: string]: any } => {
    const paramRegex = /param\s+(\w+)\s*:=\s*(.+?);/gs; // Detect parameters
    const param2DRegex = /param\s+(\w+)\s*:\s*(.+?)\s*:=\s*(.+?);/gs; // Detect 2D parameters

    const params: { [key: string]: any } = {};
    let match;

    // Parse 1D parameters
    while ((match = paramRegex.exec(content)) !== null) {
      const paramName = match[1];
      const paramValue = match[2].trim();
      params[paramName] = paramValue;
    }

    // Parse 2D parameters (e.g. `d{i,j}`)
    while ((match = param2DRegex.exec(content)) !== null) {
      const paramName = match[1];
      const paramIndices = match[2].trim();
      const paramValues = match[3].trim();
      params[paramName] = { indices: paramIndices, values: paramValues };
    }

    return params;
  };

  // Function to extract equations
  const extractEquations = (content: string): string[] => {
    const equationRegex = /s\.t\.\s*([^;]+);/gs; // Find all s.t. conditions
    const equations: string[] = [];
    let match;
    while ((match = equationRegex.exec(content)) !== null) {
      equations.push(match[0]); // Add the entire equation
    }
    return equations;
  };

  // Function to check syntax errors and highlight them
  const checkSyntax = (content: string): string[] => {
    const errors: string[] = [];
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (!/^[a-zA-Z0-9\s,:;\-=\.\*]*$/.test(line)) {
        errors.push(`Syntax error on line ${index + 1}: ${line}`);
      }
    });
    return errors;
  };

  // Highlight syntax errors in the file content
  const highlightErrors = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (syntaxErrors.some((error) => error.includes(`line ${index + 1}`))) {
        return `<span style="background-color: yellow;">${line}</span>`;
      }
      return line;
    }).join("\n");
  };

  // Function to dynamically set the height of the textarea
  const getTextAreaHeight = (value: string) => {
    const lineCount = value.split("\n").length;
    if (lineCount <= 3) return lineCount; // If <= 3 lines, show them all
    return 3; // Default to 3 lines with scroll if more
  };

  const handleParameterChange = (param: string, newValue: string) => {
    setParameters((prev) => ({
      ...prev,
      [param]: newValue,
    }));
  
    let updatedContent = fileContent;
  
    // Überprüfen, ob es sich um einen mehrdimensionalen Parameter handelt
    if (typeof parameters[param] === 'object' && parameters[param]?.indices) {
      const updated2DContent = format2DParameter(param, newValue);
      const regex = new RegExp(`param\\s+${param}\\s*:\\s*([^:=]*)\\s*:=\\s*([\\s\\S]*?);`, 'g');
      updatedContent = updatedContent.replace(regex, updated2DContent);
    } else {
      // Update für eindimensionale Parameter
      const regex = new RegExp(`param\\s+${param}\\s*:=\\s*[^;]+;`, 'g');
      updatedContent = updatedContent.replace(regex, `param ${param} := ${newValue};`);
    }
  
    setFileContent(updatedContent);
  };


  // Function to abort solving after a certain time
  const abortSolving = () => {
    if (solverAbortController.current) {
      solverAbortController.current.abort();
      setIsLoading(false);
      addMessage("Solving was aborted after the timeout.");
    }
  };




  const solve = () => {
    addMessage("Starting the solver...");
    setIsLoading(true); // Start loading animation
    const startTime = performance.now(); // Start time for solver duration

    // Set a timeout to abort the solver after 5 seconds
    solverTimeoutRef.current = setTimeout(abortSolving, 5000);

    solverAbortController.current = new AbortController();
    const { signal } = solverAbortController.current;

    try {
      var model = fileContent;  // Uses the current text field value
      var lp = GLPKAPI.glp_create_prob();
      var tran = GLPKAPI.glp_mpl_alloc_wksp();
      GLPKAPI._glp_mpl_init_rand(tran, 1);

      GLPKAPI.glp_mpl_read_model_from_string(tran, "model", model, 0);
      GLPKAPI.glp_mpl_generate(tran, null, function (data) {});
      addMessage("Model successfully converted to solver format.");

      GLPKAPI.glp_mpl_build_prob(tran, lp);
      var smcp = new GLPKAPI.SMCP({ presolve: GLPKAPI.GLP_ON });
      GLPKAPI.glp_simplex(lp, smcp);

      var iocp = new GLPKAPI.IOCP({ presolve: GLPKAPI.GLP_ON });
      GLPKAPI.glp_intopt(lp, iocp);
      GLPKAPI.glp_mpl_postsolve(tran, lp, GLPKAPI.GLP_MIP);

      addMessage("Model solved successfully.");
      setIsLoading(false); // Stop loading animation

      const endTime = performance.now(); // End time for solver duration
      const solverDuration = ((endTime - startTime) / 1000).toFixed(2); // Time in seconds
      setSolverTime(`Solver time: ${solverDuration} seconds`);
      addMessage(`Solver time: ${solverDuration} seconds`);

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

      const result = `Solution status: ${status}`;
      let variables = "Variable results:\n";
      for (var i = 1; i <= GLPKAPI.glp_get_num_cols(lp); i++) {
        variables += `${GLPKAPI.glp_get_col_name(lp, i)} = ${GLPKAPI.glp_mip_col_val(lp, i)}\n`;
      }

      // Clear timeout after successful solving
      if (solverTimeoutRef.current) clearTimeout(solverTimeoutRef.current);

      // Show result content in a popup
      setResultContent(`${result}\n\n${variables}\n\nSolver time: ${solverDuration} seconds`);
      setShowPopup(true); // Display the popup

    } catch (err) {
      setIsLoading(false); // Stop loading animation on error
      addMessage("<div class='alert alert-danger'>" + err.toString() + "</div>");
      console.log(err);
    }
  };

  // Function to download the modified file
  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "modified_file.txt";  // Filename for download
    document.body.appendChild(element); // Add element to DOM for download
    element.click();  // Automatically trigger download
    document.body.removeChild(element);  // Remove element after download
  };

  const format2DParameter = (param: string, values: string): string => {
    const lines = values.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    const header = `param ${param} : Seattle San-Diego :=`; // Header anpassen, je nach Indizes
    
    const formattedValues = lines.map((line) => {
      const formattedLine = line.split(/\s+/).join("   "); // Werte formatieren
      return `    ${formattedLine}`; // Werte ausrichten
    }).join("\n");
    
    return `${header}\n${formattedValues} ;`;
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>GMPL File Editor</h1>

      {/* File Upload */}
      <input type="file" accept=".mod,.dat,.txt,.gmpl" style={styles.fileInput} onChange={handleFileUpload} />

      {/* Parameter Editing */}
      {Object.entries(parameters).length > 0 && (
  <div style={styles.parameterGroup}>
    <h2 style={styles.subHeader}>Edit Parameters</h2>
    
    {Object.entries(parameters).map(([param, value]) => {
      // Prüfen, ob der Parameter ein Array ist oder mehrdimensionale Werte hat
      if (Array.isArray(value)) {
        // Für eindimensionale Arrays
        return (
          <div key={param} style={styles.parameterSet}>
            <label style={styles.label}>{param}:</label>
            <textarea
              style={styles.input}
              value={value.join("\n")} // Array-Werte in neue Zeilen umwandeln
              onChange={(e) => handleParameterChange(param, e.target.value.split("\n"))} // Aufteilen nach Zeilen
              rows={getTextAreaHeight(value.join("\n"))} // Dynamische Höhe basierend auf Zeilen
            />
          </div>
        );
      }

      if (typeof value === 'object' && value.values) {
        // Für mehrdimensionale Parameter
        return (
          <div key={param} style={styles.parameterSet}>
            <label style={styles.label}>{param}:</label>
            <textarea
              style={styles.input}
              value={value.values} // Für 2D-Parameter
              onChange={(e) => handleParameterChange(param, e.target.value)}
              rows={getTextAreaHeight(value.values)}
            />
          </div>
        );
      }

      // Für einfache Werte
      return (
        <div key={param} style={styles.parameterSet}>
          <label style={styles.label}>{param}:</label>
          <textarea
            style={styles.input}
            value={value} // Für 1D-Parameter
            onChange={(e) => handleParameterChange(param, e.target.value)}
            rows={getTextAreaHeight(value)}
          />
        </div>
      );
    })}

    <div style={styles.buttonContainer}>
      <button style={styles.button} onClick={solve} disabled={isLoading}>
        Calculate
      </button>
    </div>
  </div>
)}

      {/* Display Equations */}
      {equations.length > 0 && (
        <div style={styles.equationBox}>
          <h2 style={styles.subHeader}>Equations</h2>
          {equations.map((equation, index) => (
            <pre key={index} style={styles.pre}>{equation}</pre>
          ))}
        </div>
      )}

      {/* Toggle File Content */}
      {fileContent && (
        <div>
          <button
            style={styles.toggleButton}
            onClick={() => setShowFileContent(!showFileContent)}
          >
            {showFileContent ? 'Hide File Content' : 'Show File Content'}
          </button>
          
          {showFileContent && (
            <div style={styles.fileContentBox}>
              <h2 style={styles.subHeader}>File Content</h2>
              <textarea
                style={styles.textarea}
                value={highlightErrors(fileContent)} // Highlight syntax errors
                onChange={(e) => setFileContent(e.target.value)} // Update file content
                rows={10}
              />
              <button style={styles.downloadButton} onClick={downloadFile}>
                Download File
              </button>
            </div>
          )}
        </div>
      )}
      

      {/* Loading Spinner */}
      {isLoading && (
        <div style={styles.loadingSpinner}>Loading...</div>
      )}

      <div id="msgZone" style={styles.msgZone}></div>
      <div>{solverTime}</div> {/* Display Solver Time */}

      {/* Syntax Errors */}
      {syntaxErrors.length > 0 && (
        <div style={styles.syntaxErrorBox}>
          <h3>Syntax Errors</h3>
          <ul>
            {syntaxErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Syntax Error Popup */}
      {showErrorPopup && (
        <div style={styles.errorPopup}>
          <p>There are syntax errors in the file.</p>
        </div>
      )}

          {/* Solve Button */}
    <div style={styles.buttonContainer}>
    <button style={styles.button} onClick={solve} disabled={isLoading}>
      Calculate
    </button>
  </div>

      {/* Result Popup */}
      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupContent}>
            <h2>Solver Results</h2>
            <div style={styles.popupResult}>
              <pre style={styles.pre}>{resultContent}</pre>
            </div>
            <button style={styles.button} onClick={() => setShowPopup(false)}>Close</button>
          </div>
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
  toggleButton: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#007bff',
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
  textarea: {
    width: '100%',
    backgroundColor: '#202020',
    color: '#ffffff',
    border: '1px solid #8d8d8d',
    borderRadius: '5px',
    padding: '10px',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '16px',
    marginBottom: '10px',
  },
  downloadButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  loadingSpinner: {
    color: '#fff',
    fontSize: '16px',
    textAlign: 'center' as 'center',
    marginTop: '20px',
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
  syntaxErrorBox: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#ffcc00',
    borderRadius: '5px',
    color: '#333',
  },
  errorPopup: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    padding: '10px',
    backgroundColor: '#ffcc00',
    color: '#333',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
  },
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '10px',
    color: '#fff',
    textAlign: 'center' as 'center',
    width: '80%',
    maxWidth: '600px',
  },
  popupResult: {
    maxHeight: '300px',  // Limited height
    overflowY: 'auto',   // Scroll if content is too large
    textAlign: 'left' as 'left',
    padding: '10px',
    border: '1px solid #8d8d8d',
    backgroundColor: '#202020',
    color: '#ffffff',
    borderRadius: '5px',
  },
};