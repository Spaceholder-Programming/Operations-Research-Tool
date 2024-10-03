import { NextApiRequest, NextApiResponse } from 'next';
import GLPK from 'glpk.js';

interface Variable {
    name: string;
    coef: number;
}

interface Constraint {
    name: string;
    vars: Variable[];
    bnds: {
        lb: number;
        ub: number;
    };
}

interface Objective {
    direction: 'max' | 'min';
    vars: Variable[];
}

interface RequestBody {
    objective: Objective;
    constraints: Constraint[];
    bounds?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { objective, constraints, bounds }: RequestBody = req.body;

        if (!objective || !constraints) {
            return res.status(400).json({ message: 'Invalid input data. Ensure that "objective" and "constraints" are provided correctly.' });
        }

        try {
            const glpk = await GLPK();
            const options = { msglev: glpk.GLP_MSG_ALL, presol: true };

            const problem = {
                name: 'MIP',
                objective: {
                    direction: objective.direction === 'max' ? glpk.GLP_MAX : glpk.GLP_MIN,
                    name: 'obj',
                    vars: objective.vars.map((v: Variable) => ({ name: v.name, coef: v.coef }))
                },
                subjectTo: constraints.map((c: Constraint) => ({
                    name: c.name,
                    vars: c.vars.map((v: Variable) => ({ name: v.name, coef: v.coef })),
                    bnds: {
                        type: glpk.GLP_UP,
                        lb: c.bnds.lb,
                        ub: c.bnds.ub
                    }
                })),
                binaries: objective.vars.map((v: Variable) => v.name),
                generals: objective.vars.map((v: Variable) => v.name)
            };

            const result = glpk.solve(problem, options);
            res.status(200).json({ result });
        } catch (error: unknown) {
            // Type Assertion to access properties of the error object
            if (error instanceof Error) {
                console.error('Error processing optimization:', error);
                res.status(500).json({ message: 'Error processing optimization', error: error.message });
            } else {
                console.error('Unknown error:', error);
                res.status(500).json({ message: 'Error processing optimization', error: 'Unknown error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Only POST method is allowed' });
    }
}
