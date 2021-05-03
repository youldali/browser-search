import 'expect-puppeteer';
import * as puppeteer from 'puppeteer';
import type { FilterConfig } from '../../dist/';

import { storeId, indexConfig, keyPath, persons, Person } from './__fixtures__/personStore';

const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 }, 
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] }, 
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 }, 
  ],
  [
    { id: 'engineer', field: 'profession', operator: 'equals', operand: 'Production Engineer'}
  ],
  [
    { id: 'red', field: 'favoriteColours', operator: 'contains', operand: 'red'},
    { id: 'blue', field: 'favoriteColours', operator: 'contains', operand: 'blue'},
    { id: 'green', field: 'favoriteColours', operator: 'contains', operand: 'green'},
  ]
];

describe('Browser Search', () => {
  let page: puppeteer.Page;

  beforeAll(async () => {
    const browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(process.env['TEST_URL'] as string);

    const browserSearch = await page.evaluate(() => window.browserSearch);
    await expect(browserSearch).toBeDefined()

    await page.evaluate(({indexConfig, storeId, keyPath}) => window.browserSearch.createStore(storeId)(indexConfig)(keyPath),
      {keyPath, indexConfig, storeId}
    );

    await page.evaluate(({persons, storeId}) => window.browserSearch.addDataToStore(storeId)(persons),
      {persons, storeId} as any
    );
  })

  it('returns all items', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('performs a search with 1 filter', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['lowAged'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name ASC', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'ASC',
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name DESC', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'DESC',
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name ASC, gets the first 5 persons (page 1)', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'ASC',
      storeId,
      page: 1,
      perPage: 5,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name ASC, gets the next 5 persons (page 2)', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'ASC',
      storeId,
      page: 2,
      perPage: 5,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('search for the engineer profession', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['engineer'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('returns empty array when no criteria is met', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['engineer', 'lowAged'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('returns all people who like the red colour', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['red'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('returns all people who like the red / blue / green colour', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['red', 'blue', 'green'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('returns all people who like the red / blue / green colour AND are old', async () => {
    const results = await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['red', 'blue', 'green', 'highAged'],
      storeId,
      perPage: 100,
    }), { filterConfig, storeId } as any
    );

    expect(results).toMatchSnapshot();
  })

  it('returns all the colours available', async () => {
    const results = await page.evaluate(({storeId}) => window.browserSearch.getAllValuesOfProperty(
      storeId,
    )('favoriteColours'), { storeId } as any
   );

    expect(results).toMatchSnapshot();
  })

  it('returns all the countries available', async () => {
    const results = await page.evaluate(({storeId}) => window.browserSearch.getAllValuesOfProperty(
      storeId,
    )('country'), { storeId } as any
   );

    expect(results).toMatchSnapshot();
  })

  it('returns the number of items in the store', async () => {
    const results = await page.evaluate(({storeId}) => window.browserSearch.getCount(
      storeId,
    ), { storeId } as any
   );

    expect(results).toMatchSnapshot();
  })

})