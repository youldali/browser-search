export interface Interval {
    '0': number;
    '1': number;
}
declare const createInterval: (begin: number, end: number) => Interval;
export default createInterval;
