export interface Interval {
    '0': number,
    '1': number
};

const createInterval = (begin: number, end: number): Interval => {
    const getBeginAndEndAfterCheck = 
        (begin: number, end: number) => 
            begin > end ? 
            {intervalBegin: 0, intervalEnd: 0} : 
            {intervalBegin: begin, intervalEnd: end};
    
    const { intervalBegin, intervalEnd } = getBeginAndEndAfterCheck(begin, end);
    const interval = Object.defineProperties({
            '0': intervalBegin, 
            '1': intervalEnd,
        },
        {
            toString: {
                value: () => `[${intervalBegin},${intervalEnd}]`
            }
        }
    );
    return Object.freeze(interval)
}

export default createInterval;