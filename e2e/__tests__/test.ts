import 'expect-puppeteer';
import * as puppeteer from 'puppeteer';
import type { FilterConfig } from '../../dist/';

import { storeId, indexConfig, keyPath, persons, Person } from './__fixtures__/personStore';

const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: Operators.lt, operand: 30 }, 
    { id: 'middleAged', field: 'age', operator: Operators.inRangeClosed, operand: [30, 50] }, 
    { id: 'highAged', field: 'age', operator: Operators.gt, operand: 50 }, 
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: Operators.equals, operand: 'Dentist'}
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

  it('setup', async () => {
    const results = await page.evaluate(() => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      storeId,
    }), 
    );

    expect(results).toMatchSnapshot();
  })

  it('performs a search with no filter', async () => {
    const results = await page.evaluate(() => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      storeId,
    }), 
    );

    expect(results).toMatchSnapshot();
  })

  it('performs a search with 1 filter', async () => {
    const results = await page.evaluate(() => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: ['lowAged'],
      storeId,
    }), 
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name ASC', async () => {
    const results = await page.evaluate(() => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'ASC',
      storeId,
    }), 
    );

    expect(results).toMatchSnapshot();
  })

  it('sorts by name DESC', async () => {
    const results = await page.evaluate(() => window.browserSearch.processRequest<Person>({
      filterConfig,
      filtersApplied: [],
      orderBy: 'name',
      orderDirection: 'ASC',
      storeId,
    }), 
    );

    expect(results).toMatchSnapshot();
  })

})