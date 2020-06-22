//@flow

const createInterval = (begin: number, end: number): Interval => {
    const getBeginAndEndAfterCheck = (begin: number, end: number) => begin > end ? {intervalBegin: 0, intervalEnd: 0} : {intervalBegin: begin, intervalEnd: end};
    
    const { intervalBegin, intervalEnd } = getBeginAndEndAfterCheck(begin, end);
    return Object.freeze({
        '0': intervalBegin, 
        '1': intervalEnd,
    }
)};

export default createInterval;