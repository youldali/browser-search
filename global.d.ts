interface Dictionary<T> {
    [key: string]: T;
}

type UnknownObject = Dictionary<any>