import { Chance } from 'chance';
import {times} from 'ramda';

const chance = new Chance();

export const generatePerson = () => (
  {
    id: chance.guid(),
    name: chance.name(),
    age: chance.age(),
    email: chance.email(),
    salary: chance.natural({ min: 20000, max: 100000 }),
    profession: chance.profession(),
    favoriteColours: chance.pickset(['blue', 'red', 'green', 'yellow', 'brown', 'white', 'dark', 'purple', 'pink'], chance.natural({ min: 0, max: 4 })),
    country: chance.country({ full: true }),
  }
)

export const generatePersons = (n: number) => times(generatePerson, n);