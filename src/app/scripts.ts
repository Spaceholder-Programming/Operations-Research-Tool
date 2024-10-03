import * as MIP from "../pages/parseMIP"
import * as LP from "../pages/parseLP"
import * as LPAPI from "../pages/api/optimizeLP.js"

import * as GLPKAPI from "../solver/glpk.min.js"
import { start } from "repl";

// custom log so we can append the output dynamically
function customLog(message: string) {
  console.log(message); // Continue to print message inside of box

  // Get Output Box
  const outputElement = document.getElementById('out');

  // Append message if element exists
  if (outputElement) {
    outputElement.innerHTML += message + "<br>"; // Append message
  }
}

function customLogClear() {
  const outElement = document.getElementById('out');
  if (outElement) {
    outElement.innerHTML = "";
  }
}

function walltimeStopAndPrint(startpoint: number) {
  // calculating elapsed time as timestamp
  var duration = Date.now() - startpoint;

  // Calculate seconds and ms
  const seconds = Math.floor(duration / 1000);
  const milliseconds = (duration % 1000) / 1000;

  // formatting
  const durationFormatted = seconds + (milliseconds >= 0 ? "." : ".") + Math.abs(milliseconds).toFixed(3).slice(2);

  // Printing elapsed time
  customLog("Elapsed time: " + durationFormatted + " seconds<br>");

  // return durationFormatted;
}

function walltimeStart() {
  return Date.now();
}

function isInputFilled(obj: string | undefined, subj: string | undefined, bounds: string | undefined, vars: string | undefined) {
  if (obj == "" || obj == null || obj == undefined) {
    customLog("Error: Empty input field.");
    return false;
  }
  if (subj == "" || subj == null || subj == undefined) {
    customLog("Error: Empty input field.");
    return false;
  }
  if (bounds == "" || bounds == null || bounds == undefined) {
    customLog("Error: Empty input field.");
    return false;
  }
  if (vars == "" || vars == null || vars == undefined) {
    customLog("Error: Empty input field.");
    return false;
  }
  return true;
}

export function calculate_click() {
  customLogClear();
  const timer = walltimeStart();
  customLog("Calculating...<br>");

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

  // let funcs:string[] = functions.split(/;/);
  // let vars:string[] = variables.split(/;/);

  // let direction = null;

  // let namesVars:string[] = [];

  // let variablesMIP:VariableMIP[];
  // let variablesLP:VariableLP[];

  // // console.log(vars);

  // for (const decider of vars) {

  //   // match comments
  //   let regexMatch:RegExpMatchArray|null = decider.match(/#.*/);
  //   if (regexMatch != null)
  //     continue;

  //   regexMatch = decider.match(/var/);
  //   if (regexMatch != null)
  //     namesVars.push(regexMatch[1]);



  //   console.log(regexMatch);
  // }


  // for (const decider of funcs) {
  //   let dir = decider.match(/(min|max) .*/);
  //   if (direction != null && dir != null) {
  //     document.getElementById('out').innerHTML = "ERROR: Multiple Functions!";
  //     return;
  //   }
  //   if (direction == null && dir != null) {
  //     direction = dir[1];
  //     let test = parseFunction(decider);
  //     console.log(test?.name);
  //     variablesLP.
  //     continue;
  //   }

  //   console.log(direction);

  //   document.getElementById('out').innerHTML = direction;

  //   console.log(parseFunction(decider));

  
  // catch error: empty input field(s)
  if (!isInputFilled(objective, subject, bounds, variables)) return;

  let wholeText: string = "Maximize\n obj: " + objective
                        + "\nSubject To \n" + subject 
                        + "\nBounds \n" + bounds
                        + "\nGenerals \n" + variables
                        + "\nEnd";

  // customLog("<br><br>DEBUGGING<br><br>\nfunctions:<br>" + functions + "<br><br>variables:<br>" + variables + "<br><br>DEBUGGING END<br>");

  customLog("Running optimization with input: \"" + wholeText + "\"<br>");
  run(wholeText);

  walltimeStopAndPrint(timer);
}

function run(text: string) {
  customLog("Starting problem setup...");
  var lp = GLPKAPI.glp_create_prob();
  GLPKAPI.glp_read_lp_from_string(lp, null, text);
  customLog("Problem created.<br>");

  customLog("Scaling problem...");
  GLPKAPI.glp_scale_prob(lp, GLPKAPI.GLP_SF_AUTO);
  customLog("Scaling complete.<br>");

  customLog("Starting simplex optimization...");
  var smcp = new GLPKAPI.SMCP({ presolve: GLPKAPI.GLP_ON });
  GLPKAPI.glp_simplex(lp, smcp);
  customLog("Simplex optimization complete.<br>");

  customLog("Starting integer optimization...");
  var iocp = new GLPKAPI.IOCP({ presolve: GLPKAPI.GLP_ON });
  GLPKAPI.glp_intopt(lp, iocp);
  customLog("Integer optimization complete.<br>");

  // customLog("obj: " + GLPKAPI.glp_mip_obj_val(lp));
  customLog("<i>Final objective value: " + GLPKAPI.glp_mip_obj_val(lp) + "</i><br>");
  customLog("Value of each variable:");
  for (var i = 1; i <= GLPKAPI.glp_get_num_cols(lp) - 1; i++) {   // "-1" to remove the "End-variable" from logs
    customLog(GLPKAPI.glp_get_col_name(lp, i) + " = " + GLPKAPI.glp_mip_col_val(lp, i));
  }
  customLog("");

  customLog("Dual values of constraints:");
    for (var j = 1; j <= GLPKAPI.glp_get_num_rows(lp); j++) {
        const dualValue = GLPKAPI.glp_get_row_dual(lp, j); // fetch dual
        const constraintName = GLPKAPI.glp_get_row_name(lp, j);
        customLog(constraintName + " dual = " + dualValue);
    }
  customLog("");
}

function downloadLPFormatting(objective: any, subject: any, bounds: any) {
  customLog("Preparing file content string...<br>");
  
  // ensure that all vars are strings
  const formattedObjective = typeof objective === 'string' ? objective : '';
  const formattedSubject = typeof subject === 'string' ? subject : '';
  const formattedBounds = typeof bounds === 'string' ? bounds : '';

  // Header mit Problemname
  const header = "\\ Your problem\n";

  //  format objective
  const objectiveFunction = `Maximize\n obj: ${formattedObjective}\n`;

  // turn each subject into a single line
  const constraints = `Subject To\n${formattedSubject.split("\n").filter(line => line.trim() !== "").map(line => ` ${line}`).join("\n")}\n`;

  // format bounds
  const boundsFormatted = `Bounds\n${formattedBounds.split("\n").filter(line => line.trim() !== "").map(line => ` ${line}`).join("\n")}\n`;

  // summarizing everything into one var
  const lpFormat = `${header}${objectiveFunction}${constraints}${boundsFormatted}End\n`;

  return lpFormat;
}




function downloadProblemDownload(content: string) {
  customLog("Preparing file...<br>")
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'problem.txt'; // file name
  link.click(); // starting download
  customLog("Starting download.")
}

export function downloadLP() {
  customLogClear();
  customLog("Preparing download...<br>");
  customLog("Fetching input...<br>")

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

// Irgend ein Interface
// document.getElementById('out').innerHTML = funcs;

// output.innerHTML = functions.innerHTML;

// createProblemMIP();

// LPAPI.default();


export function import_click() {
  console.log("Importing...");
}


// export function export_click() {
//   console.log("Exporting...");

// }

// function parseFunction(toParse: string) {
//   var regex = toParse.match(/([a-zA-Z][a-zA-Z0-9]*):/);
//   if (regex == null)
//     return;
//   var name = regex[1];

//   regex = toParse.match(/(?:([0-9]*) *\* *([a-zA-Z][a-zA-Z0-9]*))/g);

//   let coefs:number[] = [];
//   let vars:string[] = [];

//   for (const rg of regex) {
//     coefs.push(+rg.match(/([0-9]+)/g));
//     vars.push(rg.match(/([a-zA-Z][a-zA-Z0-9]*)/g)[0]);
//   }
//   return {name, coefs, vars};
// }
