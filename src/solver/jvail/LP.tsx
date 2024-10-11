import {Variable} from "./Variable";
import {Bound} from "./Bound";
import {Options} from "./Options";
import {Constraint} from "./Constraint";

export interface LP {
    name: string,
    objective: {
        direction: number,
        name: string,
        vars: Variable[]
    },
    subjectTo: Constraint[],
    bounds?: Bound[],
    binaries?: string[],
    generals?: string[],
    options?: Options
}