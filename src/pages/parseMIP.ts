interface VariableMIP {
  name: string;
  coef: number;
}

interface Bounds {
  type: number;
  ub: number;
  lb: number;
}

interface ConstraintMIP {
  name: string;
  vars: VariableMIP[];
  bnds: Bounds;
}

interface Options {
  mipgap: number;
  tmlim: number;
  msglev: number;
}

interface Problem {
  name: string;
  objective: {
    direction: "min" | "max";
    name: string;
    vars: VariableMIP[];
  };
  constraints: ConstraintMIP[];
  binaries?: string[];
  generals?: string[];
  options: Options;
}

function createProblemMIP(
  name: string,
  direction: "min" | "max",
  objectiveName: string,
  objectiveVars: VariableMIP[],
  constraints: { name: string; vars: VariableMIP[]; bnds_type: number; ub: number; lb: number }[],
  binaries: string[],
  generals: string[] = [],
  mipgap: number,
  tmlim: number,
  msglev: number
): Problem {
  const constraintsFormatted: ConstraintMIP[] = constraints.map((constraint) => ({
    name: constraint.name,
    vars: constraint.vars,
    bnds: {
      type: constraint.bnds_type,
      ub: constraint.ub,
      lb: constraint.lb
    }
  }));

  const problem: Problem = {
    name: name,
    objective: {
      direction: direction,
      name: objectiveName,
      vars: objectiveVars
    },
    constraints: constraintsFormatted,
    binaries: binaries.length > 0 ? binaries : undefined,
    generals: generals.length > 0 ? generals : undefined,
    options: {
      mipgap: mipgap,
      tmlim: tmlim,
      msglev: msglev
    }
  };

  return problem;
}


export function parseLP(input: string) {
  console.log("Parsing MIP file:", input);
}