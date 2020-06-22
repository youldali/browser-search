// @flow

import { has } from 'ramda';

//has at least 1 property
export const
hasOne = (properties: Array<string>) => (target: Object): boolean => (
	properties.reduce( (hasFound: boolean, nextPropertyToFind: string) => {
		return hasFound || has(nextPropertyToFind, target)
	}, false)
);