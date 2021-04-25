require ('expect-puppeteer')
const puppeteer = require('puppeteer');

const storeId = 'persons';
const indexConfig = {
  name: 'simple',
  age: 'simple',
  salary: 'simple',
  profession: 'simple',
  country: 'simple',
  favoriteColours: 'array'
};
const keyPath= 'id';

const data = [{
  id: '1',
  name: 'Mister U',
  age: 29,
  email: 'misterU@gmail.com',
  salary: 20000,
  profession: 'singer',
  favoriteColours: ['red'],
  country: 'US',
},
{
  id: '2',
  name: 'JayZ',
  age: 50,
  email: 'JayZ@gmail.com',
  salary: 50000,
  profession: 'singer',
  favoriteColours: ['red', 'blue'],
  country: 'US',
}
]



const filterConfig = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 }, // Filter
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] }, // Filter
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 }, // Filter
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];

const url = 'http://localhost:8081';
describe('Google', () => {
  let page;
  beforeAll(async () => {
    const browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(url);
  })

  it('browser search should be defined on window', async () => {
    const browserSearch = await page.evaluate(() => window.browserSearch);
    await expect(browserSearch).toBeDefined()
  })

  it('performs a search', async () => {
    const storeCreation = await page.evaluate(({indexConfig, storeId, keyPath}) => window.browserSearch.createStore(storeId)(indexConfig)(keyPath),
      {keyPath, indexConfig, storeId}
    );

    const addData = await page.evaluate(({data, storeId}) => window.browserSearch.addDataToStore(storeId)(data),
      {data, storeId}
    );
    
    const processRequest = await page.evaluate((request) => window.browserSearch.processRequest(request),
      {
        filterConfig,
        filtersApplied: ['lowAged'],
        orderBy: 'name',
        page: 1,
        storeId,
      }
    );

    console.log(processRequest);

  })

})