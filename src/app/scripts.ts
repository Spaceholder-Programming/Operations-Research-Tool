import { LP } from "../solver/jvail/LP";
import { Bound } from "../solver/jvail/Bound";
import { Variable } from "../solver/jvail/Variable";
import { Bounds, GLP_MAX, GLP_MIN, GLP_UP, GLP_LO, GLP_FX, GLP_FR, GLP_DB } from "../solver/jvail/Bounds";
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

export function isInputFilled(obj: string | undefined, subj: string | undefined, bounds: string | undefined, vars: string | undefined) {
  // if empty input: fetching inputs
  if (obj == "" || subj == "" || bounds == "" || vars == "") {
    const objectiveElement = document.getElementById('objective');
    if (objectiveElement !== null) {
      obj = (objectiveElement as HTMLInputElement).value;
    }

    const subjectElement = document.getElementById('subject');
    if (subjectElement !== null) {
      subj = (subjectElement as HTMLInputElement).value;
    }


    const boundsElement = document.getElementById('bounds');
    if (boundsElement !== null) {
      bounds = (boundsElement as HTMLInputElement).value;
    }

    const varsElement = document.getElementById('vars');
    if (varsElement !== null) {
      vars = (varsElement as HTMLInputElement).value;
    }
  }
  
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

  // Header with problem name
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
  customLog("downloadCheckInput");
  customLog("");

  if (!isInputFilled("","","","")) return;

  let exportString: string | undefined = getInputsForLPAsString();

  if (exportString === undefined) return;

  downloadProblemDownload(exportString);
}

function getInputsForLP() {
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

  return { objective, subject, bounds };
}

function getInputsForLPAsString(): string {

  let inputs = getInputsForLP();
  let obj = inputs?.objective;
  let sub = inputs?.subject;
  let bnds = inputs?.bounds;

  const exportString: string = downloadLPFormatting(obj, sub, bnds);

  return exportString;
}

export function convertLPToMPS(lp: LP): string {
  let mpsString = '';

  // NAME section
  mpsString += `NAME          ${lp.name}\n`;

  // ROWS section
  mpsString += 'ROWS\n';
  mpsString += ` N  ${lp.objective.name}\n`; // Objective row
  lp.subjectTo.forEach(constraint => {
    if (constraint.bounds.type === GLP_UP) { // <=
      mpsString += ` L  ${constraint.name}\n`;
    } else if (constraint.bounds.type === GLP_LO) { // >=
      mpsString += ` G  ${constraint.name}\n`;
    } else if (constraint.bounds.type === GLP_FX) { // =
      mpsString += ` E  ${constraint.name}\n`;
    }
  });

  // COLUMNS section
  mpsString += 'COLUMNS\n';
  const variableMap: { [key: string]: { row: string; coef: number }[] } = {};
  lp.objective.vars.forEach(varObj => {
    if (!variableMap[varObj.name]) {
      variableMap[varObj.name] = [];
    }
    variableMap[varObj.name].push({ row: lp.objective.name, coef: varObj.coef });
  });
  lp.subjectTo.forEach(constraint => {
    constraint.vars.forEach(varObj => {
      if (!variableMap[varObj.name]) {
        variableMap[varObj.name] = [];
      }
      variableMap[varObj.name].push({ row: constraint.name, coef: varObj.coef });
    });
  });

  for (const [variable, rows] of Object.entries(variableMap)) {
    rows.forEach(entry => {
      mpsString += `    ${variable}  ${entry.row}  ${entry.coef}\n`;
    });
  }

  // RHS section
  mpsString += 'RHS\n';
  lp.subjectTo.forEach(constraint => {
    if (constraint.bounds.type === GLP_UP) { // <= or =
      mpsString += `    RHS1  ${constraint.name}  ${constraint.bounds.ub}\n`;
    } else if (constraint.bounds.type === GLP_LO || constraint.bounds.type === GLP_FX) { // >=
      mpsString += `    RHS1  ${constraint.name}  ${constraint.bounds.lb}\n`;
    }
  });

  // BOUNDS section
  if (lp.bounds && lp.bounds.length > 0) {
    mpsString += 'BOUNDS\n';
    lp.bounds.forEach(bound => {
      if (bound.lb !== -Infinity) {
        mpsString += ` LO BND1  ${bound.name}  ${bound.lb}\n`;
      }
      if (bound.ub !== Infinity) {
        mpsString += ` UP BND1  ${bound.name}  ${bound.ub}\n`;
      }
    });
  }

  // BINARY section
  if (lp.binaries && lp.binaries.length > 0) {
    mpsString += 'BINARY\n';
    lp.binaries.forEach(bin => {
      mpsString += `    ${bin}\n`;
    });
  }

  // GENERAL section
  if (lp.generals && lp.generals.length > 0) {
    mpsString += 'GENERAL\n';
    lp.generals.forEach(gen => {
      mpsString += `    ${gen}\n`;
    });
  }

  // ENDATA section
  mpsString += 'ENDATA\n';

  return mpsString;
}

// read LP format from string
function parseLP(lpString: string): LP {
  const lines = lpString.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  let mode: string = '';
  let lp: LP = {
    name: '',
    objective: {
      direction: GLP_MAX, // 1 for maximize, -1 for minimize
      name: '',
      vars: []
    },
    subjectTo: [],
    bounds: [],
    binaries: [],
    generals: []
  };

  let objectiveExpression = '';
  let constraintExpression = '';
  let currentConstraintName = '';

  for (let line of lines) {

    // handle each block differently
    // set mode for each to determine parsing path
    if (line.startsWith("Maximize")) {
      lp.objective.direction = GLP_MAX;
      mode = 'objective';
      continue;
    } else if (line.startsWith("Minimize")) {
      lp.objective.direction = GLP_MIN;
      mode = 'objective';
      continue;
    } else if (line.startsWith("Subject To")) {
      // Constraint section
      if (objectiveExpression.length > 0) {
        lp.objective.vars = parseLPExpression(objectiveExpression.trim());
        objectiveExpression = '';
      }
      mode = 'subjectTo';
      continue;
    } else if (line.startsWith("Bounds")) {
      // Bound section
      if (constraintExpression.length > 0 && currentConstraintName.length > 0) {
        const { vars, bound } = parseLPConstraint(constraintExpression.trim());
        lp.subjectTo.push({
          name: currentConstraintName,
          vars: vars,
          bounds: bound
        });
        constraintExpression = '';
        currentConstraintName = '';
      }
      mode = 'bounds';
      continue;
    } else if (line.startsWith("Binary")) {
      mode = 'binaries';
      continue;
    } else if (line.startsWith("General")) {
      mode = 'generals';
      continue;
    } else if (line.startsWith("End")) {
      mode = 'end';
      continue;
    }

    // Parse based on current mode
    if (mode === 'objective') {
      const splitLine = line.split(":");
      if (splitLine.length === 2) {
        lp.objective.name = splitLine[0].trim(); // if name in first line
        objectiveExpression += splitLine[1].trim() + ' ';
      } else {
        objectiveExpression += line.trim() + ' '; // multiline expansion of objective
      }

    } else if (mode === 'subjectTo') {
      const splitLine = line.split(":");
      if (splitLine.length === 2) {
        if (constraintExpression.length > 0 && currentConstraintName.length > 0) {
          // new Constraint -> add previous to the subjects
          const { vars, bound } = parseLPConstraint(constraintExpression.trim());
          lp.subjectTo.push({
            name: currentConstraintName,
            vars: vars,
            bounds: bound
          });
        }
        // start collecting the new constraint
        currentConstraintName = splitLine[0].trim();
        constraintExpression = splitLine[1].trim() + ' ';
      } else {
        // continue collecting the expression if it's multi-line
        constraintExpression += line.trim() + ' ';
      }
    } else if (mode === 'bounds') {
      const bound = parseLPBound(line.trim());
      if (bound && lp.bounds) {
        lp.bounds.push(bound);
      }
    } else if (mode === 'binaries') {
      lp.binaries?.push(line.trim());
    } else if (mode === 'generals') {
      lp.generals?.push(line.trim());
    }
  }

  // if no "subject to" previously, do it here
  if (objectiveExpression.length > 0) {
    lp.objective.vars = parseLPExpression(objectiveExpression.trim());
  }

  // same for "bounds" and "end"
  if (constraintExpression.length > 0 && currentConstraintName.length > 0) {
    const { vars, bound } = parseLPConstraint(constraintExpression.trim());
    lp.subjectTo.push({
      name: currentConstraintName,
      vars: vars,
      bounds: bound
    });
  }

  return lp;
}

// Helper for expressions
function parseLPExpression(expr: string): Variable[] {
  const regex = /([+-]?\s*\d*\.?\d*)\s*([a-zA-Z_][a-zA-Z_0-9]*)/g;
  let match;
  let vars: Variable[] = [];

  // loop over all variables in expresion
  while ((match = regex.exec(expr)) !== null) {
    let temp_coef = match[1].replace(/\s+/g, '').trim() || '1';
    temp_coef = temp_coef === "-" || temp_coef === '+' ? `${temp_coef}1` : temp_coef;
    const coef = parseFloat(temp_coef);
    const name = match[2];
    vars.push({ name: name, coef: coef });
  }

  return vars;
}

// Helper for Constraint section
function parseLPConstraint(constraint: string): { vars: Variable[], bound: Bounds } {
  // Valid operators in Constraints
  const operators = ["<=", ">=", "="];
  let operator = operators.find(op => constraint.includes(op));
  if (!operator) {
    throw new Error(getTranslation("err_invalidConstraintFormat"));
  }

  const [expr, boundStr] = constraint.split(operator);
  const vars: Variable[] = parseLPExpression(expr.trim());
  const boundValue = parseFloat(boundStr.trim());

  // determine bound type
  let boundType = GLP_UP;
  if (operator === "<=") {
    boundType = GLP_UP;
  } else if (operator === ">=") {
    boundType = GLP_LO;
  } else if (operator === "=") {
    boundType = GLP_FX;
  }
  let lb = boundType === GLP_FX ? boundValue : boundType === GLP_LO ? boundValue : -Infinity;
  let ub = boundType === GLP_UP ? boundValue : Infinity;

  const bound: Bounds = {
    type: boundType,
    lb: lb,
    ub: ub
  } as Bounds;

  return { vars, bound };
}

// Helper for Bound section
function parseLPBound(boundStr: string): Bound | null {
  // Regex to handle various bound formats
  const regex = /^([-]?\d*\.?\d*)?\s*(<=|>=|=)?\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(<=|>=|=)?\s*([-]?\d*\.?\d*)?$/;
  const match = regex.exec(boundStr.trim());

  if (match) {
    const [, lbStr, leftOperator, varName, rightOperator, ubStr] = match;
    let lb = lbStr ? parseFloat(lbStr) : undefined;
    let ub = ubStr ? parseFloat(ubStr) : undefined;
    let type: number;

    // Handle free "edgecase"
    if (boundStr.toLowerCase().includes('free')) {
      return {
        type: GLP_FR,
        name: varName,
        lb: -Infinity,
        ub: Infinity
      } as Bound;
    }

    // Determine bound type
    if (leftOperator && rightOperator) {
      if (leftOperator === '<=' && rightOperator === '<=') {
        type = GLP_DB; // Double bound
      } else if (leftOperator === '>=' && rightOperator === '>=') {
        type = GLP_DB; // Double bound (reverse order)
        [lb, ub] = [ub, lb]; // Swap lb and ub
      } else {
        return null; // Invalid combination
      }
      // detect one-sided bounds
    } else if (leftOperator === '<=') {
      type = GLP_UP;
      ub = lb;
      lb = undefined;
    } else if (rightOperator === '<=') {
      type = GLP_UP;
    } else if (leftOperator === '>=') {
      type = GLP_LO;
    } else if (rightOperator === '>=') {
      type = GLP_LO;
      lb = ub;
      ub = undefined;
    } else if (leftOperator === '=' || rightOperator === '=') {
      type = GLP_FX;
      if (leftOperator === '=') ub = lb;
      else lb = ub;
    } else {
      type = GLP_FR; // No bounds specified, assume free
    }

    return {
      type,
      name: varName,
      lb: lb !== undefined ? lb : -Infinity,
      ub: ub !== undefined ? ub : Infinity
    } as Bound;
  }
  return null;
}

export function downloadMPS() {
  customLogClear();
  customLog("downloadPrep");
  customLog("");
  customLog("downloadCheckInput");
  customLog("");
  if (!isInputFilled("","","","")) return;

  let inputs = getInputsForLPAsString();
  let lp = parseLP(inputs);
  let mps = convertLPToMPS(lp);

  downloadProblemDownload(mps);
}