export function test() {
  console.log("Dies ist die Testfunktion.");
}

export function calculate_click() {
  console.log("Calculating...");

  let functions:string = document.getElementById('funcs').value;
  let variables:string = document.getElementById('vars').value;

  let funcs:string[] = functions.split(/; */);
  let vars:string[] = variables.split(/; */);


  // Irgend ein Interface
  // document.getElementById('out').innerHTML = funcs;

  // output.innerHTML = functions.innerHTML;

}

export function import_click() {
  console.log("Importing...");
}


export function export_click() {
  console.log("Exporting...");

}