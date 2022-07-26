export const createFixture = <T>(fixture: T) => (
  overrides: Partial<T> = {},
): T => ({ ...fixture, ...overrides });

export const createArrayFixture = <T>(fixture: T[]) => (
  overrides: T[] = [],
): T[] => ([ ...fixture, ...overrides ]);