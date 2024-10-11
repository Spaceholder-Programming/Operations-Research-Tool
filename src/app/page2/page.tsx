'use client'

import { useState, useRef, useEffect } from 'react';
import * as GLPKAPI from "../../solver/glpk.min.js"

export default function GMPLFileEditor() {
  const [fileContent, setFileContent] = useState<string>(''); 
  const [isFileUploaded, setIsFileUploaded] = useState(false); 
  const [showFileContent, setShowFileContent] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [solverTime, setSolverTime] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false); 
  const [resultContent, setResultContent] = useState<string>(''); 
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]); 
  const [showErrorPopup, setShowErrorPopup] = useState(false); 
  const solverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const solverAbortController = useRef<AbortController | null>(null); 
  const [highlightedContent, setHighlightedContent] = useState<string>('');

  useEffect(() => {
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

  const updateHighlightedContent = (content: string) => {
    const highlighted = highlightErrors(content);
    setHighlightedContent(highlighted);
  };

// Function to handle file upload
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    setFileContent(content);
    updateHighlightedContent(content);
    addMessage("File successfully uploaded and read.");
    setIsFileUploaded(true);

    // Perform syntax check
    const errors = checkSyntax(content);
    setSyntaxErrors(errors);
    updateHighlightedContent(content);
  };
  reader.readAsText(file);
};

const checkSyntax = (content: string): string[] => {
  const errors: string[] = [];
  const lines = content.split("\n");

  const ignorePattern = /^(#|\/\/|printf|\/\*|\*).*$/; 

  lines.forEach((line, index) => {
    if (ignorePattern.test(line) || line.trim() === "") {
      return; // Ignore this line
    }

    const validGmplLinePattern = /^(var|param|set|maximize|minimize|s\.t\.|subject to|for|in|if|then|else|end|:=|<=|>=|=|\+|\-|\*|\/|[a-zA-Z_][a-zA-Z0-9_]*\s*[=<>+\-*/]*\s*[0-9a-zA-Z_]+.*;)/;

    if (!validGmplLinePattern.test(line)) {
      errors.push(`Syntax error on line ${index + 1}: ${line}`);
    }
  });

  return errors;
};

// Highlight syntax errors in the file content
const highlightErrors = (content: string) => {
  const lines = content.split("\n");
  return lines.map((line, index) => {
    const error = syntaxErrors.find((error) => error.includes(`line ${index + 1}`));
    if (error) {
      return `<span style="background-color: yellow; color: black;" title="${error}">${line}</span>`;
    }
    return line; 
  }).join("\n");
};

// Function to dynamically set the height of the textarea
const getTextAreaHeight = (value: any) => { 
  const stringValue = String(value); 
  const lineCount = stringValue.split("\n").length;
  if (lineCount <= 3) return lineCount; 
  return 3; 
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
  setIsLoading(true); 
  const startTime = performance.now(); 

  // Set a timeout to abort the solver after 5 seconds
  solverTimeoutRef.current = setTimeout(abortSolving, 5000);

  solverAbortController.current = new AbortController();
  const { signal } = solverAbortController.current;

  try {
    var model = fileContent;  
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
    setIsLoading(false); 

    const endTime = performance.now(); 
    const solverDuration = ((endTime - startTime) / 1000).toFixed(2); 
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
    if (solverTimeoutRef.current) clearTimeout(solverTimeoutRef.current);
    setResultContent(`${result}\n\n${variables}\n\nSolver time: ${solverDuration} seconds`);
    setShowPopup(true); 

  } catch (err) {
    setIsLoading(false); 
    addMessage("<div class='alert alert-danger'>" + err.toString() + "</div>");
    console.log(err);
  }
};

// Function to download the modified file
const downloadFile = () => {
  const element = document.createElement("a");
  const file = new Blob([fileContent], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "problem.gmpl";  
  document.body.appendChild(element); 
  element.click();
  document.body.removeChild(element);
};

return (
  <div style={styles.container}>
    <h1 style={styles.header}>General Linear Problems</h1>

    {/* File Upload */}
    <input type="file" accept=".mod,.dat,.txt,.gmpl" style={styles.fileInput} onChange={handleFileUpload} />

    {/* Show Calculate and Highlight Toggle buttons only if file is uploaded */}
    {isFileUploaded && (
      <>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={solve} disabled={isLoading}>
            Calculate
          </button>
        </div>
      </>
    )}

    {fileContent && (
      <div>
        
        {showFileContent && (
          <div style={styles.fileContentBox}>
            <h2 style={styles.subHeader}>File Content</h2>
            {/* Use a textarea for editable text */}
            <textarea
              style={styles.textarea}
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                updateHighlightedContent(e.target.value); 
              }}
              rows={getTextAreaHeight(fileContent)}
            />
            <button style={styles.downloadButton} onClick={downloadFile}>
              Download GMPL File
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
    overflow: 'scroll',
    maxHeight: '800px',
    minHeight: '400px',

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