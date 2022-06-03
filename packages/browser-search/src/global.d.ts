interface Dictionary<T> {
    [key: string]: T;
}

type UnknownObject = Dictionary<any>

type StringOrNumber = string | number;

type ItemKey = StringOrNumber;
