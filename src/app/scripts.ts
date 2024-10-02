import * as MIP from "../pages/parseMIP.ts"
import * as LP from "../pages/parseLP.ts"
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
  document.getElementById('out').innerHTML = "";
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

export function calculate_click() {
  customLogClear();
  const timer = walltimeStart();
  customLog("Calculating...<br>");

  let functions: string | undefined = document.getElementById('funcs').value;
  let variables: string | undefined = document.getElementById('vars').value;

  if (functions == undefined || variables == undefined) return;
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

  let wholeText: string = functions + "\nGenerals \n" + variables + "End";

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
        const dualValue = GLPKAPI.glp_get_row_dual(lp, j); // Abrufen des dualen Wertes
        const constraintName = GLPKAPI.glp_get_row_name(lp, j);
        customLog(constraintName + " dual = " + dualValue);
    }
  customLog("");
}

// Irgend ein Interface
// document.getElementById('out').innerHTML = funcs;

// output.innerHTML = functions.innerHTML;

// createProblemMIP();

// LPAPI.default();


export function import_click() {
  console.log("Importing...");
}


export function export_click() {
  console.log("Exporting...");

}

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
