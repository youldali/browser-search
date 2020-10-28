interface Dictionary<T> {
    [key: string]: T;
}

type UnknownObject = Dictionary<any>

type StringOrNumber = string | number;

declare module 'web-worker:*' {
    const WorkerFactory: new () => Worker;
    export default WorkerFactory;
}