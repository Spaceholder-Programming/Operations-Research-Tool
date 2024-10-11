'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useContext, useRef, useEffect } from 'react';
import text from "../lang";
import { LanguageContext } from '../context/LanguageContext';
import * as GLPKAPI from "../../solver/glpk.min.js"



const GlpPage = () => {
    const router = useRouter();

    const { language, setLanguage } = useContext(LanguageContext);
    const [model, setModel] = useState('gen');

    const tr_hTitle = text(language, 'header_title');
    const tr_hSubtitle = text(language, 'header_subtitle');
    const tr_calcButton = text(language, "buttonCalc");
    const tr_GmplTitle = text(language, 'GmplHeader');
    const tr_GenProblems = text(language, 'GenProblem');
    const tr_SpecProblems = text(language, 'SpecProblem');
    const tr_fileUpload = text(language, 'FileUpload');
    const tr_fileName = text(language, 'FileName');




    const [fileContent, setFileContent] = useState<string>('');
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [showFileContent, setShowFileContent] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [solverTime, setSolverTime] = useState<string>('');
    const [showPopup, setShowPopup] = useState(false);
    const [resultContent, setResultContent] = useState<string>('');
    //const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const solverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const solverAbortController = useRef<AbortController | null>(null);
    //const [highlightedContent, setHighlightedContent] = useState<string>('');
    const [fileName, setFileName] = useState<string>("");


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

    //useEffect(() => {
    //    if (syntaxErrors.length > 0) {
    //       setShowErrorPopup(true);
    //    }
    //}, [syntaxErrors]);

    const addMessage = (message: string) => {
        const msgZone = document.getElementById("msgZone");
        if (msgZone) {
            msgZone.innerHTML += `<div>${message}</div>`;
        }
    };

   // const updateHighlightedContent = (content: string) => {
   //     const highlighted = highlightErrors(content);
   //     setHighlightedContent(highlighted);
   // };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
          }
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
         //   updateHighlightedContent(content);
            addMessage("File successfully uploaded and read.");
            setIsFileUploaded(true);

            // Perform syntax check
            //const errors = checkSyntax(content);
            //setSyntaxErrors(errors);
         //   updateHighlightedContent(content);
        };
        reader.readAsText(file);
    };

    //const checkSyntax = (content: string): string[] => {
    //    const errors: string[] = [];
    //    const lines = content.split("\n");
    //
    //   const ignorePattern = /^(#|\/\/|printf|\/\*|\*).*$/;
    //
    //   lines.forEach((line, index) => {
    //        if (ignorePattern.test(line) || line.trim() === "") {
    //           return; // Ignore this line
    //        }
    //
    //        const validGmplLinePattern = /^(var|param|set|maximize|minimize|s\.t\.|subject to|for|in|if|then|else|end|:=|<=|>=|=|\+|\-|\*|\/|[a-zA-Z_][a-zA-Z0-9_]*\s*[=<>+\-*/]*\s*[0-9a-zA-Z_]+.*;)/;
    //
    //        if (!validGmplLinePattern.test(line)) {
    //            errors.push(`Syntax error on line ${index + 1}: ${line}`);
    //        }
    //    });
    //
    //    return errors;
    //};

    // Highlight syntax errors in the file content
    //const highlightErrors = (content: string) => {
    //    const lines = content.split("\n");
    //    return lines.map((line, index) => {
    //        const error = syntaxErrors.find((error) => error.includes(`line ${index + 1}`));
    //        if (error) {
    //            return `<span style="background-color: yellow; color: black;" title="${error}">${line}</span>`;
    //        }
    //        return line;
    //    }).join("\n");
    //};

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
            GLPKAPI.glp_mpl_generate(tran, null, function () { });
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
        <div>
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
                            <option value="gen">{tr_GenProblems}</option>
                            <option value="spec">{tr_SpecProblems}</option>
                        </select>
                    </main>
                </div>
            </header>

            <div className="containerGmpl">
                <h1 className="headerGmpl">{tr_GmplTitle}</h1>

                {/* File Upload */}
                <div className="button_spec">
                    <label htmlFor="fileUpload" className="button_green">
                    {tr_fileUpload}
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        accept=".mod,.dat,.txt,.gmpl"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                    />
                    <span className="fileName">
                        {fileName ? fileName : tr_fileName}
                    </span>
                </div>

                {isFileUploaded && (
                    <>
                        <div className="buttoncontainerGmpl">
                            <button className="button_green" onClick={solve} disabled={isLoading}>
                                {tr_calcButton}
                            </button>
                        </div>
                    </>
                )}

                {fileContent && (
                    <div>
                        {showFileContent && (
                            <div className="fileContentBox">
                                <h2 className="subheaderGmpl">File Content</h2>
                                {/* Use a textarea for editable text */}
                                <textarea
                                    className="textarea"
                                    value={fileContent}
                                    onChange={(e) => {
                                        setFileContent(e.target.value);
                                        //updateHighlightedContent(e.target.value);
                                    }}
                                    rows={getTextAreaHeight(fileContent)}
                                />
                                <button className="button" onClick={downloadFile}>
                                    Download GMPL File
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="loadingSpinner">Loading...</div>
                )}

                <div id="msgZone" className="msgZone"></div>
                <div>{solverTime}</div> {/* Display Solver Time */}

                {/* Syntax Errors 
                {syntaxErrors.length > 0 && (
                    <div className="syntaxErrorBox">
                        <h3>Syntax Errors</h3>
                        <ul>
                            {syntaxErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                    */}

                {/* Syntax Error Popup 
                {showErrorPopup && (
                    <div className="errorPopup">
                        <p>There are syntax errors in the file.</p>
                    </div>
                )}
                */}

                {/* Result Popup */}
                {showPopup && (
                    <div className="popup">
                        <div className="popupContent">
                            <h2>Solver Results</h2>
                            <div className="popupResult">
                                <pre className="pre">{resultContent}</pre>
                            </div>
                            <button className="button_green" onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );



};

export default GlpPage;