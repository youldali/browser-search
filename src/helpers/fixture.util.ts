export const createFixture = <T>(fixture: T) => (
  overrides: Partial<T> = {},
) => ({ ...fixture, ...overrides });

export const createArrayFixture = <T>(fixture: T[]) => (
  overrides: T[] = [],
) => ([ ...fixture, ...overrides ]);