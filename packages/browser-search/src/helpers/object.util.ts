import { has } from 'ramda';

export const
hasOneProperty = <T>(properties: Array<string>) => (target: T): boolean => (
	properties.reduce( (hasFound: boolean, nextPropertyToFind: string) => {
		return hasFound || has(nextPropertyToFind, target)
	}, false)
);