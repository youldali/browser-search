export type Colour = 'blue' | 'red' | 'green' | 'yellow' | 'brown' | 'white' | 'dark' | 'purple' | 'pink';

export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  salary: number;
  profession: string;
  favoriteColours: Colour[];
  country: string;
}
