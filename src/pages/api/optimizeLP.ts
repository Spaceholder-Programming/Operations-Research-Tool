import { NextApiRequest, NextApiResponse } from 'next';
import GLPK from 'glpk.js';
import { Result } from 'glpk.js';

interface Variable {
    name: string;
    coef: number;
}

interface Objective {
    direction: 'max' | 'min';
    vars: Variable[];
}

interface Bounds {
    ub: number;
    lb: number;
}

interface Constraint {
    name: string;
    vars: Variable[];
    bnds: Bounds;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { objective, constraints } = req.body;

        try {
            const glpk = await GLPK();
            const options = {
                msglev: glpk.GLP_MSG_ALL,
                presol: true,
                tmlim: 1000,
                cb: {
                    call: (result: Result) => {
                        console.log('GLPK Result:', result); 
                    }
                    
                    ,
                    each: 1
                }
            };
            

            const problem = {
                name: 'LP',
                objective: {
                    direction: objective.direction === 'max' ? glpk.GLP_MAX : glpk.GLP_MIN,
                    name: 'obj',
                    vars: objective.vars
                },
                subjectTo: constraints.map((c: Constraint) => ({
                    name: c.name,
                    vars: c.vars,
                    bnds: {
                        type: glpk.GLP_DB,
                        ub: c.bnds.ub,
                        lb: c.bnds.lb
                    }
                }))
            };
            const result = glpk.solve(problem, options); 

            const lpFormat = `\n# Problem Definition\n
                name: ${problem.name}\n
                # Objective Function\n
                ${problem.objective.direction === glpk.GLP_MAX ? 'max' : 'min'} ${problem.objective.vars.map((v: Variable) => `${v.coef} ${v.name}`).join(' + ')}\n
                # Constraints\n
                ${problem.subjectTo.map((c: Constraint) => `${c.vars.map((v: Variable) => `${v.coef} ${v.name}`).join(' + ')} ${c.bnds.ub ? `<= ${c.bnds.ub}` : ''}`).join('\n')}\n`;

            res.status(200).json({ result, lpFormat });
        } catch (error) {
            console.error('Error processing optimization:', error);
            res.status(500).json({ message: 'Error processing optimization', error: (error as Error).message });
        }        
    } else {
        res.status(405).json({ message: 'Only POST method is allowed' });
    }
}