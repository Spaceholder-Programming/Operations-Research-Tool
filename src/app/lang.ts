export default function text(lang: string, input: string): string {
    // German translation
    if (lang === "ger") {
        switch (input) {
            case "header_title":
                return "OR-Tool";
            case "header_subtitle":
                return "von Spaceholder Programming";
            case "boxObjTitle":
                return "Ziel";
            case "boxObjDesc":
                return "Gib hier dein Ziel ein. Es ist nur ein Ziel erlaubt. Verwende eine Zeile dafür (kein \"Return\"!). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\nx + y\n-786433 x1 + 655361 x2";
            case "boxSubjTitle":
                return "Nebenbedingungen";
            case "boxSubjDesc":
                return "Gib hier dein Nebenbedingungen ein. Eines pro Zeile (trenne mit der 'Return'-Taste). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\n+1 x + 2 y <= 15\n524321 x14 + 524305 x15 <= 4194303.5";
            case "boxBoundsTitle":
                return "Grenzen";
            case "boxBoundsDesc":
                return "Gib hier deine Grenzen ein. Eine pro Zeile (trenne mit der 'Return'-Taste). Erlaubte Symbole sind 0-9, a-z, A-Z und <>=.\nBeispiel:\nx >= 0\nx > 0\n0 <= x1 <= 1";
            case "boxVarsTitle":
                return "Variablen";
            case "boxVarsDesc":
                return "Liste alle deine Variablen auf. Eine pro Zeile (trenne mit der 'Return'-Taste). Erlaubte Symbole sind a-z, A-Z.\nBeispiel:\nx\ny";
            case "boxExportLP":
                return "Exportieren als LP";
            case "boxOut":
                return "Geben Sie ein Problem und eine Aktionstaste ein, um die Ausgabe anzuzeigen...";
            case "buttonCalc":
                return "Berechnen";
            default:
                return "Fehler: Übersetzung nicht gefunden";
        }
        
    }

    // English translation
    if (lang === "eng") {
        switch (input) {
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
            case "boxOut":
                return "Input a problem and an action button to display output...";
            case "buttonCalc":
                return "Calculate";
            default:
                return "Error: Translation Not Found";
        }
    }

    return "Error: Translation Module - Language Not Known.";
}
