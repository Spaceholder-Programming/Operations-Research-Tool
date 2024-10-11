import {Variable} from "./Variable";
import {Bounds} from "./Bounds";

export interface Constraint {
    name: string;
    vars: Variable[];
    bounds: Bounds;
}