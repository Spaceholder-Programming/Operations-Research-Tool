import { NextApiRequest, NextApiResponse } from 'next';
import GLPK from 'glpk.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { objective, constraints } = req.body;

        try {
            const glpk = await GLPK();
            const options = {
                msglev: glpk.GLP_MSG_ALL,
                presol: true,
                cb: {
                    call: (progress: any) => console.log(progress),
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
                subjectTo: constraints.map((c: any) => ({
                    name: c.name,
                    vars: c.vars,
                    bnds: {
                        type: glpk.GLP_UP,
                        ub: c.bnds.ub,
                        lb: c.bnds.lb
                    }
                }))
            };

            const result = glpk.solve(problem, options);

            const lpFormat = `\n# Problem Definition\n
                name: ${problem.name}\n
                # Objective Function\n
                ${problem.objective.direction === glpk.GLP_MAX ? 'max' : 'min'} ${problem.objective.vars.map((v: any) => `${v.coef} ${v.name}`).join(' + ')}\n
                # Constraints\n
                ${problem.subjectTo.map((c: any) => `${c.vars.map((v: any) => `${v.coef} ${v.name}`).join(' + ')} ${c.bnds.ub ? `<= ${c.bnds.ub}` : ''}`).join('\n')}\n`;

            res.status(200).json({ result, lpFormat });
        } catch (error) {
            console.error('Error processing optimization:', error);
            res.status(500).json({ message: 'Error processing optimization', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Only POST method is allowed' });
    }
}