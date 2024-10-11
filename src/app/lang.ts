export default function text(lang: string, input: string): string {
    // German translation
    if (lang === "ger") {
        switch (input) {
            case "header_title":
                return "OR-Tool";
                case "header_subtitle":
                    return "von Spaceholder Programming";
                case "download_gmpl":
                    return "GMPL-Datei herunterladen";
                case "solver_time_lang":
                    return "Solver Laufzeit";
                case "boxObjTitle":
                    return "Ziel";
                case "GmplHeader":
                    return "Allgemeine Lineare Probleme";
                case "FileUpload":
                    return "Datei hochladen";
                case "FileName":
                    return "Kein File ausgewählt";
                case "SpecProblem":
                    return "Spezifisches Problem";
                case "GenProblem":
                    return "Allgemeines Lineares Problem";
                case "boxObjDesc":
                    return "Geben Sie Ihr Ziel hier ein. Es ist nur ein Ziel erlaubt. Verwenden Sie eine Zeile dafür (kein 'Enter'!). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\nx + y\n-786433 x1 + 655361 x2";
                case "boxSubjTitle":
                    return "Nebenbedingungen";
                case "boxSubjDesc":
                    return "Geben Sie Ihre Nebenbedingungen hier ein. Eine pro Zeile (mit der 'Enter'-Taste trennen). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\n+1 x + 2 y <= 15\n524321 x14 + 524305 x15 <= 4194303.5";
                case "boxBoundsTitle":
                    return "Grenzen";
                case "boxBoundsDesc":
                    return "Geben Sie Ihre Grenzen hier ein. Eine pro Zeile (mit der 'Enter'-Taste trennen). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\nx >= 0\nx > 0\n0 <= x1 <= 1";
                case "boxVarsTitle":
                    return "Variablen";
                case "boxVarsDesc":
                    return "Listen Sie alle Ihre Variablen auf. Eine pro Zeile (mit der 'Enter'-Taste trennen). Erlaubte Symbole sind a-z, A-Z.\nBeispiel:\nx\ny";
                case "boxExportLP":
                    return "Als LP exportieren";
                case "boxExportMPS":
                    return "Als MPS exportieren";
                case "boxOut":
                    return "Geben Sie ein Problem ein und drücken Sie eine Aktionstaste, um die Ausgabe anzuzeigen...";
                case "buttonCalc":
                    return "Berechnen";
                case "etime":
                    return "Berechnungsdauer";
                case "seconds":
                    return "Sekunden";
                case "err_invalidInput":
                    return "Fehler: Ungültige Eingabe in";
                case "err_nullInput":
                    return "Fehler: NULL- oder undefinierte Eingabe in";
                case "err_invalidInput":
                    return "Fehler: Ungültige Eingabe oder fehlendes Zeichen in";
                case "input_checks_successful":
                    return "Alle Eingabeprüfungen erfolgreich.";
                case "input_checks_start":
                    return "Starte Eingabeprüfungen...";
                case "obj_box":
                    return "Zielfeld";
                case "subj_box":
                    return "Bedingungsfeld";
                case "bounds_box":
                    return "Grenzenfeld";
                case "vars_box":
                    return "Variablenfeld";
                case "err_emptyBox":
                    return "Fehler: Leeres Textfeld.";
                case "calculating":
                    return "Berechne...";
                case "maximize":
                    return "Maximieren";
                case "minimize":
                    return "Minimieren";
                case "run_optimization":
                    return "Optimierung mit Eingaben wird ausgeführt";
                case "startProblemSetup":
                    return "Starte Problemerstellung...";
                case "succProblemSetup":
                    return "Problem erstellt.";
                case "startScaling":
                    return "Skalieren des Problems...";
                case "succScaling":
                    return "Skalierung erfolgreich.";
                case "startOptimizationSimplex":
                    return "Starte Simplex-Optimierung...";
                case "succOptimizationSimplex":
                    return "Simplex-Optimierung abgeschlossen.";
                case "startOptimizationInteger":
                    return "Starte Ganzzahloptimierung...";
                case "succOptimizationInteger":
                    return "Ganzzahloptimierung abgeschlossen.";
                case "finalObjValue":
                    return "Endgültiger Zielfunktionswert";
                case "varsValues":
                    return "Wert jeder Variable";
                case "dualValues":
                    return "Dualwerte der Einschränkungen";
                case "downloadPrepFileString":
                    return "Dateiinhalt wird vorbereitet...";
                case "downloadPrepFile":
                    return "Datei wird vorbereitet...";
                case "downloadStart":
                    return "Download wird gestartet.";
                case "downloadPrep":
                    return "Download wird vorbereitet...";
                case "downloadFetchInput":
                    return "Eingaben werden geladen...";
                case "downloadCheckInput":
                    return "Überprüfe auf leere Eingabefelder...";
                case "importing":
                    return "Importiere...";
                case "err_invalidConstraintFormat":
                    return "Fehler: Nicht erlaubter Operator verwendet.";
            default:
                return input;
        }
        
    }

    // English translation
    if (lang === "eng") {
        switch (input) {
            case "download_gmpl":
                return  "Download GMPL-File";
            case "solver_time_lang":
                return "Solver Time";
            case "GmplHeader":
                return "General Linear Problems";
            case "SpecProblem":
                return "Specific Problem";
            case "FileUpload":
                return "Upload File";
            case "FileName":
                return "No File selected";
            case "GenProblem":
                return "General Linear Problems";
            case "header_title":
                return "OR-Tool";
            case "header_subtitle":
                return "by Spaceholder Programming";
            case "boxObjTitle":
                return "Objective";
            case "boxObjDesc":
                return "Insert your objective here. One objective is allowed. Use one line for it (no \"return\"!) Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx + y\n-786433 x1 + 655361 x2";            
                case "boxSubjTitle":
                return "Subject";
            case "boxSubjDesc":
                return "Insert your subject here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\n+1 x + 2 y <= 15\n524321 x14 + 524305 x15 <= 4194303.5";
            case "boxBoundsTitle":
                return "Bounds";
            case "boxBoundsDesc":
                return "Insert your bounds here. One per line (divide by 'return' button). Allowed symbols are 0-9, a-z, A-Z and <>=.\nExample:\nx >= 0\nx > 0\n0 <= x1 <= 1";
            case "boxVarsTitle":
                return "Variables";
            case "boxVarsDesc":
                return "List all your variables. One per line (divide by 'return' button). Allowed symbols are a-z, A-Z.\nExample:\nx\ny";
            case "boxExportLP":
                return "Export as LP";
            case "boxExportMPS":
                return "Export as MPS";
            case "boxOut":
                return "Input a problem and an action button to display output...";
            case "buttonCalc":
                return "Calculate";
            case "etime":
                return "Elapsed time";
            case "seconds":
                return "seconds";
            case "err_invalidInput":
                return "Error: Invalid input in";
            case "err_nullInput":
                return "Error: NULL or undefined input in";
            case "err_invalidInput":
                return "Error: Invalid input or missing character in";
            case "input_checks_successful":
                return "All input checks successful."
            case "input_checks_start":
                return "Starting input checks...";
            case "obj_box":
                return "object box";
            case "subj_box":
                return "subject box";
            case "bounds_box":
                return "bounds box";
            case "vars_box":
                return "variables box";
            case "err_emptyBox":
                return "Error: Empty text box.";
            case "calculating":
                return "Calculating...";
            case "maximize":
                return "Maximize";
            case "minimize":
                return "Minimize";
            case "run_optimization":
                return "Running optimization with input";
            case "startProblemSetup":
                return "Starting problem setup...";
            case "succProblemSetup":
                return "Problem created.";
            case "startScaling":
                return "Scaling problem...";
            case "succScaling":
                return "Scaling successful.";
            case "startOptimizationSimplex":
                return "Starting simplex optimization...";
            case "succOptimizationSimplex":
                return "Simplex optimization complete.";
            case "startOptimizationInteger":
                return "Starting integer optimization...";
            case "succOptimizationInteger":
                return "Integer optimization complete.";
            case "finalObjValue":
                return "Final objective value";
            case "varsValues":
                return "Value of each variable";
            case "dualValues":
                return "Dual values of constraints";
            case "downloadPrepFileString":
                return "Preparing file content string...";
            case "downloadPrepFile":
                return "Preparing file...";
            case "downloadStart":
                return "Starting download.";
            case "downloadPrep":
                return "Preparing download...";
            case "downloadFetchInput":
                return "Fetching input...";
            case "downloadCheckInput":
                return "Checking for empty input boxes...";
            case "importing":
                return "Importing...";
            case "err_invalidConstraintFormat":
                return "Error: Invalid constraint format.";
            default:
                return input;
        }
    }

    return "Error: Translation Module - Language Not Known.";
}
