type VariableLP = { name: string; coef: number };
type ConstraintLP = {
  name: string;
  vars: VariableLP[];
  bnds: { ub: number; lb: number };
};

interface ProblemLP {
  objective: {
    vars: VariableLP[];
  };
  constraints: ConstraintLP[];
}

function createProblemLP(
  objectiveVars: VariableLP[],
  constraints: { name: string; vars: VariableLP[]; ub: number; lb: number }[]
): ProblemLP {
  const constraintsFormatted: ConstraintLP[] = constraints.map((constraint) => ({
    name: constraint.name,
    vars: constraint.vars,
    bnds: {
      ub: constraint.ub,
      lb: constraint.lb
    }
  }));

  const problem: ProblemLP = {
    objective: {
      vars: objectiveVars
    },
    constraints: constraintsFormatted
  };

  return problem;
}

export function parseLP(input: string) {
  console.log("Parsing LP file:", input);
}