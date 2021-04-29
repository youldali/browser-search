import * as browserSearch from '../dist/';

declare global {
  interface Window { browserSearch: typeof browserSearch; }
}
