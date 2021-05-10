export const createFixture = <T>(fixture: T) => (
  overrides: Partial<T> = {},
) => ({ ...fixture, ...overrides });
