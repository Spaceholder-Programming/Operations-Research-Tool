import * as MIP from "../parser/parseMIP"
import * as LP from "../parser/parseLP"
import * as LPAPI from "../api/optimizeLP.js"

import * as GLPKAPI from "../solver/glpk.min.js"
import { start } from "repl";

import text from "./lang"

// custom log so we can append the output dynamically
export function customLog(input: string) {
  // get language
  const lang = (document.getElementById('language_current') as HTMLSelectElement)?.value;

  // Get Output Box
  const outputElement = document.getElementById('out');

  // load text
  const message: string = text(lang, input);
  console.log(message); // Continue to print message inside of box

  // Append message if element exists
  if (outputElement) {
    outputElement.innerHTML += message + "<br>"; // Append message
  }
}

export function customLogClear() {
  const outElement = document.getElementById('out');
  if (outElement) {
    outElement.innerHTML = "";
  }
}

export function getTranslation(input: string) {
  // get language
  const lang = (document.getElementById('language_current') as HTMLSelectElement)?.value;

  // return translation
  return text(lang, input);
}

function walltimeStopAndPrint(startpoint: number) {
  // calculating elapsed time as timestamp
  let duration = Date.now() - startpoint;

  // Calculate seconds and ms
  const seconds = Math.floor(duration / 1000);
  const milliseconds = (duration % 1000) / 1000;

  // formatting
  const durationFormatted = seconds + (milliseconds >= 0 ? "." : ".") + Math.abs(milliseconds).toFixed(3).slice(2);

  // Printing elapsed time
  customLog(getTranslation("etime") + ": " + durationFormatted + " " + getTranslation("seconds"));
  customLog("");

  // return durationFormatted;
}

function walltimeStart() {
  return Date.now();
}

export function isInputValidRegex(obj: string | undefined, subj: string | undefined, bounds: string | undefined, vars: string | undefined): boolean {
  customLog("input_checks_start");

  // standard case: input is undefined - invalid
  if (obj === undefined || obj === null || subj === undefined || subj === null || bounds === undefined || bounds === null || vars === undefined || vars === null) {
    customLog(getTranslation("err_nullInput") + "function isInputValidRegex.");
    return false;
  }

  // RegEx check for objective
  let regex = /^[ (\n)]*[\+-]? *((\d+(.\d+)? )?[a-zA-Z][a-zA-Z0-9]*)( *[\+-] *((\d+(.\d+)? )?[a-zA-Z][a-zA-Z0-9]*))*[ (\n)]*$/g;
  let isValid = regex.test(obj);
  if (!isValid) {
    customLog(getTranslation("err_invalidInput") + " " + getTranslation("obj_box") + ".");
    return false;
  }

  // RegEx check for subject
  regex = /^([ (\n)]*[\+-]* *(\d+(.\d+)? )?[a-zA-Z][a-zA-Z0-9]*( *[\+-] *(\d+(.\d+)? )?[a-zA-Z][a-zA-Z0-9]*)* *((<=?)|(>=?)|=) *[\+-]? *\d+(.\d+)?[ (\n)]*)+$/g;
  isValid = regex.test(subj);
  if (!isValid) {
    customLog(getTranslation("err_invalidInput") + " " + getTranslation("subj_box") + ".");
    return false;
  }

  // RegEx check for subject
  regex = /[ (\n)]*(([a-zA-Z][a-zA-Z0-9]* *((<=?)|(>=?)|=) *\d(.\d+)?)|((\d(.\d+)?) *<=? *[a-zA-Z][a-zA-Z0-9]* *<= *(\d(.\d+)?)))[ (\n)]*/g;
  isValid = regex.test(bounds);
  if (!isValid) {
    customLog(getTranslation("err_invalidInput") + " " + getTranslation("bounds_box") + ".");
    return false;
  }

  // RegEx check for variables
  regex = /^ *([a-zA-Z][a-zA-Z0-9]*(\n)* *)+$/g;
  isValid = regex.test(vars);
  if (!isValid) {
    customLog(getTranslation("err_invalidInput") + " " + getTranslation("vars_box") + ".");
    return false;
  }

  customLog("input_checks_successful");
  customLog("");
  return true;
}

export function isInputFilled(obj: string | undefined, subj: string | undefined, bounds: string | undefined, vars: string | undefined): boolean {
  if (obj == "" || obj == null || obj == undefined) {
    customLog("err_emptyBox");
    return false;
  }
  if (subj == "" || subj == null || subj == undefined) {
    customLog("err_emptyBox");
    return false;
  }
  if (bounds == "" || bounds == null || bounds == undefined) {
    customLog("err_emptyBox");
    return false;
  }
  if (vars == "" || vars == null || vars == undefined) {
    customLog("err_emptyBox");
    return false;
  }
  return true;
}

export function calculate_click() {
  customLogClear();
  const timer = walltimeStart();
  customLog("calculating");
  customLog("");

  let objective: string | undefined;
  const objectiveElement = document.getElementById('objective');
  if (objectiveElement !== null) {
    objective = (objectiveElement as HTMLInputElement).value;
  }

  let subject: string | undefined;
  const subjectElement = document.getElementById('subject');
  if (subjectElement !== null) {
    subject = (subjectElement as HTMLInputElement).value;
  }

  let bounds: string | undefined;
  const boundsElement = document.getElementById('bounds');
  if (boundsElement !== null) {
    bounds = (boundsElement as HTMLInputElement).value;
  }

  let variables: string | undefined;
  const varsElement = document.getElementById('vars');
  if (varsElement !== null) {
    variables = (varsElement as HTMLInputElement).value;
  }

  // catch error: empty input field(s)
  if (!isInputFilled(objective, subject, bounds, variables)) return;

  // catch error: variables field has invalid characters
  if (!isInputValidRegex(objective, subject, bounds, variables)) return;

  // fetch operator
  const maxmin = (document.getElementById('maxminswitch') as HTMLSelectElement)?.value;
  let operator = "Minimize";
  if (maxmin == "maximize") operator = "Maximize";

  let wholeText: string = operator + "\n obj: " + objective
    + "\nSubject To \n" + subject
    + "\nBounds \n" + bounds
    + "\nGenerals \n" + variables
    + "\nEnd";

  customLog(getTranslation("run_optimization") + ": \"" + wholeText + "\"");
  customLog("");
  run(wholeText);

  walltimeStopAndPrint(timer);
}

function run(text: string) {
  customLog("startProblemSetup");
  let lp = GLPKAPI.glp_create_prob();
  GLPKAPI.glp_read_lp_from_string(lp, null, text);
  customLog("succProblemSetup");
  customLog("");

  customLog("startScaling");
  GLPKAPI.glp_scale_prob(lp, GLPKAPI.GLP_SF_AUTO);
  customLog("succScaling");
  customLog("");

  customLog("startOptimizationSimplex");
  let smcp = new GLPKAPI.SMCP({ presolve: GLPKAPI.GLP_ON });
  GLPKAPI.glp_simplex(lp, smcp);
  customLog("succOptimizationSimplex");
  customLog("");

  customLog("startOptimizationInteger");
  let iocp = new GLPKAPI.IOCP({ presolve: GLPKAPI.GLP_ON });
  GLPKAPI.glp_intopt(lp, iocp);
  customLog("succOptimizationInteger");
  customLog("");

  // customLog("obj: " + GLPKAPI.glp_mip_obj_val(lp));
  customLog("<i>" + getTranslation("finalObjValue") + ": " + GLPKAPI.glp_mip_obj_val(lp) + "</i>");
  customLog("");
  customLog(getTranslation("varsValues") + ":");
  for (let i = 1; i <= GLPKAPI.glp_get_num_cols(lp); i++) {
    customLog(GLPKAPI.glp_get_col_name(lp, i) + " = " + GLPKAPI.glp_mip_col_val(lp, i));
  }
  customLog("");

  customLog(getTranslation("dualValues") + ":");
  for (let j = 1; j <= GLPKAPI.glp_get_num_rows(lp); j++) {
    const dualValue = GLPKAPI.glp_get_row_dual(lp, j); // fetch dual
    const constraintName = GLPKAPI.glp_get_row_name(lp, j);
    customLog(constraintName + " dual = " + dualValue);
  }
  customLog("");
}

export function downloadLPFormatting(objective: any, subject: any, bounds: any) {
  customLog(getTranslation("downloadPrepFileString"));
  customLog("");

  // ensure that all vars are strings
  const formattedObjective = typeof objective === 'string' ? objective : '';
  const formattedSubject = typeof subject === 'string' ? subject : '';
  const formattedBounds = typeof bounds === 'string' ? bounds : '';

  // fetch operator
  const maxmin = (document.getElementById('maxminswitch') as HTMLSelectElement)?.value;
  let operator = "Minimize";
  if (maxmin == "maximize") operator = "Maximize";

  // Header mit Problemname
  const header = "\\ Your problem\n";

  //  format objective
  const objectiveFunction = operator + `\n obj: ${formattedObjective}\n`;

  // turn each subject into a single line
  const constraints = `Subject To\n${formattedSubject.split("\n").filter(line => line.trim() !== "").map(line => ` ${line}`).join("\n")}\n`;

  // format bounds
  const boundsFormatted = `Bounds\n${formattedBounds.split("\n").filter(line => line.trim() !== "").map(line => ` ${line}`).join("\n")}\n`;

  // summarizing everything into one var
  const lpFormat = `${header}${objectiveFunction}${constraints}${boundsFormatted}End\n`;

  return lpFormat;
}

function downloadProblemDownload(content: string) {
  customLog("downloadPrepFile");
  customLog("");
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'problem.txt'; // file name
  link.click(); // starting download
  customLog("downloadStart");
}

export function downloadLP() {
  customLogClear();
  customLog("downloadPrep");
  customLog("");
  customLog("downloadFetchInput");
  customLog("");

  let objective: string | undefined;
  const objectiveElement = document.getElementById('objective');
  if (objectiveElement !== null) {
    objective = (objectiveElement as HTMLInputElement).value;
  }

  let subject: string | undefined;
  const subjectElement = document.getElementById('subject');
  if (subjectElement !== null) {
    subject = (subjectElement as HTMLInputElement).value;
  }

  let bounds: string | undefined;
  const boundsElement = document.getElementById('bounds');
  if (boundsElement !== null) {
    bounds = (boundsElement as HTMLInputElement).value;
  }

  let variables: string | undefined;
  const varsElement = document.getElementById('vars');
  if (varsElement !== null) {
    variables = (varsElement as HTMLInputElement).value;
  }

  // catch error: empty input field(s)
  if (!isInputFilled(objective, subject, bounds, variables)) return;

  const exportString: string = downloadLPFormatting(objective, subject, bounds);

  downloadProblemDownload(exportString);
}
