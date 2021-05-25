export declare const createFixture: <T>(fixture: T) => (overrides?: Partial<T>) => T & Partial<T>;
export declare const createArrayFixture: <T>(fixture: T[]) => (overrides?: T[]) => T[];
