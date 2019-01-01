import {Triplet} from "./Trilpet";

export class TripletHelper {
    static create(s='?s', p = '?p', o='?o'): Triplet{
        return [s,p, o];
    }
}
