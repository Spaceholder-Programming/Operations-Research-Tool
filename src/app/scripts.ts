import * as MIP from "../pages/parseMIP.ts"
import * as LP from "../pages/parseLP.ts"
import * as LPAPI from "../pages/api/optimizeLP.js"

import * as GLPKAPI from "../solver/glpk.min.js"

export function test() {
  console.log("Dies ist die Testfunktion.");
}

export function calculate_click() {
  console.log("Calculating...");

  let functions:string|undefined = document.getElementById('funcs').value;
  let variables:string|undefined = document.getElementById('vars').value;

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

  let wholeText:string = functions + "\nGenerals \n"+variables + "End";

  run(wholeText);




  }

  function run(text:string){
    var lp = GLPKAPI.glp_create_prob();
    GLPKAPI.glp_read_lp_from_string(lp, null, text);

    GLPKAPI.glp_scale_prob(lp, GLPKAPI.GLP_SF_AUTO);

    var smcp = new GLPKAPI.SMCP({presolve: GLPKAPI.GLP_ON});
    GLPKAPI.glp_simplex(lp, smcp);

    var iocp = new GLPKAPI.IOCP({presolve: GLPKAPI.GLP_ON});
    GLPKAPI.glp_intopt(lp, iocp);

    console.log("obj: " + GLPKAPI.glp_mip_obj_val(lp));
    document.getElementById('out').innerHTML = GLPKAPI.glp_mip_obj_val(lp);
    for(var i = 1; i <= GLPKAPI.glp_get_num_cols(lp); i++){
      console.log(GLPKAPI.glp_get_col_name(lp, i)  + " = " + GLPKAPI.glp_mip_col_val(lp, i));
    }
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