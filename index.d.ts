declare global {
    interface Dictionary<T> {
        [key: string]: T;
    }
  }
  

export interface Dictionary<T> {
    [key: string]: T;
}

export type UnknownObject = Dictionary<any>

type StringOrNumber = string | number;

type ItemKey = StringOrNumber;
