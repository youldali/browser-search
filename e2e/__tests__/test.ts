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
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const createStore = async () => {
    await page.evaluate(({indexConfig, storeId, keyPath}) => window.browserSearch.createStore(storeId)(indexConfig)(keyPath),
      {keyPath, indexConfig, storeId}
    );
  }

  const addDataToStore = async () => {
    await page.evaluate(({persons, storeId}) => window.browserSearch.addDataToStore(storeId)(persons),
      {persons, storeId} as any
    );
  }

  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(process.env['TEST_URL'] as string);

    const browserSearch = await page.evaluate(() => window.browserSearch);
    expect(browserSearch).toBeDefined();
  })

  afterEach(async () => {
    await page.evaluate(() => window.browserSearch.deleteAllStores());
  })

  describe('search', () => {

    beforeEach(async () => {
      await createStore();
      await addDataToStore();
    })

    describe('successes', () => {

      it('returns all items', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            storeId,
            perPage: 100,
          })
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('performs a search with 1 filter', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['lowAged'],
            storeId,
            perPage: 100,
          })
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name DESC', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'DESC',
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC, gets the first 5 persons (page 1)', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            storeId,
            page: 1,
            perPage: 5,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC, gets the next 5 persons (page 2)', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            storeId,
            page: 2,
            perPage: 5,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('search for the engineer profession', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['engineer'],
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns empty array when no criteria is met', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['engineer', 'lowAged'],
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red colour', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['red'],
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red / blue / green colour', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['red', 'blue', 'green'],
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red / blue / green colour AND are old', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [results] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['red', 'blue', 'green', 'highAged'],
            storeId,
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })

      it('runs 2 concurrents searches', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}) => {
          const [resultsA] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['red'],
            orderBy: 'name',
            orderDirection: 'ASC',
            storeId,
            perPage: 3,
          });
          const [resultsB] = window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['blue'],
            orderBy: 'name',
            orderDirection: 'DESC',
            storeId,
            perPage: 3,
          });

          return Promise.all([resultsA, resultsB]);
        }
        , { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    })
    
    describe('Failures', () => {
      it('aborts the search', async () => {
        try {
          const documents = await page.evaluate(({filterConfig, storeId}) => {
            const [results, abort] = window.browserSearch.processRequest<Person>({
              filterConfig,
              filtersApplied: [],
              storeId,
              perPage: 5,
            });
            abort();
            return results;
          }, { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })

      it('returns an error when the filter config is undefined', async () => {
        try {
          await page.evaluate(({storeId}) => window.browserSearch.processRequest<Person>({
            filterConfig: undefined as any,
            filtersApplied: [],
            storeId,
            page: 2,
            perPage: 5,
          }), { storeId } as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the store does not exist', async () => {
        try {
          await page.evaluate(({filterConfig}) => window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            storeId: 'unknown',
            page: 2,
            perPage: 5,
          }), { filterConfig } as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the filter to apply does not exist', async () => {
        try {
          await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: ['unknown'],
            storeId,
            page: 2,
            perPage: 5,
          }), { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the page has the wrong format', async () => {
        try {
          await page.evaluate(({filterConfig, storeId}) => window.browserSearch.processRequest<Person>({
            filterConfig,
            filtersApplied: [],
            storeId,
            page: -5,
            perPage: 5,
          }), { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
  
    })
  })
  
  describe('createStore', () => {
    it('successfully creates the store', async () => {
      const results = await page.evaluate(({indexConfig, storeId, keyPath}) => window.browserSearch.createStore(storeId)(indexConfig)(keyPath),
        {keyPath, indexConfig, storeId}
      );
      const doesStoreExist = await page.evaluate(({storeId}) => window.browserSearch.doesStoreExist(storeId),
       {storeId}
      );
      expect(doesStoreExist).toBeTruthy();
    });
  });

  describe('doesStoreExist', () => {

    beforeEach(async () => {
      await createStore();
    })

    it('returns true if the store exists', async () => {
      const doesStoreExist = await page.evaluate(({storeId}) => window.browserSearch.doesStoreExist(storeId),
        {storeId}
      );

      expect(doesStoreExist).toBe(true);
    });

    it('returns false if the store does not exist', async () => {
      const doesStoreExist = await page.evaluate(() => window.browserSearch.doesStoreExist('unknown'),
      );

      expect(doesStoreExist).toBe(false);
    });
  });

  describe('addDataToStore', () => {

    beforeEach(async () => {
      await createStore();
    })

    describe('successes', () => {
      it('succeeds when the data is matching the store', async () => {

        await page.evaluate(
          ({storeId, persons}) => window.browserSearch.addDataToStore(storeId)(persons)
          ,{ storeId, persons } as any
        );
  
        const results = await page.evaluate(
          ({storeId, persons}) => window.browserSearch.getItems<Person>(storeId)([persons[0].id])
          ,{ storeId, persons } as any
        );
  
        expect(results).toEqual([persons[0]]);
      });
    })
    
    describe('failures', () => {
      it('fails when the key already exists', async () => {
        try {
          
          await page.evaluate(
            ({storeId, persons}) => {
              window.browserSearch.addDataToStore(storeId)(persons);
              window.browserSearch.addDataToStore(storeId)(persons);
            }
            ,{ storeId, persons: [persons[0]]} as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
        
      });
  
      it('fails when the store does not exist', async () => {
        try {
          await page.evaluate(
            ({persons}) => window.browserSearch.addDataToStore('unknown')(persons)
            ,{ persons: [persons[0]]} as any
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      });
    })
    
  });


  describe('getAllValuesOfProperty', () => {
    
    beforeEach(async () => {
      await createStore();
      await addDataToStore();
    })

    describe('successes', () => {
      it('returns all the colours available', async () => {
        const results = await page.evaluate(({storeId}) => window.browserSearch.getAllValuesOfProperty(
          storeId,
        )('favoriteColours'), { storeId }
      );
    
        expect(results).toMatchSnapshot();
      })
    
      it('returns all the countries available', async () => {
        const results = await page.evaluate(({storeId}) => window.browserSearch.getAllValuesOfProperty(
          storeId,
        )('country'), { storeId }
      );
    
        expect(results).toMatchSnapshot();
      })
    })

    describe('failures', () => {
      it('fails when the property is not indexed', async () => {
        try {
          await page.evaluate(({storeId}) => window.browserSearch.getAllValuesOfProperty(
            storeId,
          )('unknown'), { storeId }
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })

      it('fails when the store does not exist', async () => {
        try {
          await page.evaluate(() => window.browserSearch.getAllValuesOfProperty(
            'unknown',
          )('country')
          );
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
    })
  })
  

  describe.only('getCount', () => {

    beforeEach(async () => {
      await createStore();
      await addDataToStore();
    })

    it('returns the number of items in the store', async () => {
      const results = await page.evaluate(({storeId}) => window.browserSearch.getCount(
        storeId,
      ), { storeId } as any
     );
  
      expect(results).toBe(persons.length);
    })

    it('fails when the store does not exist', async () => {
      try {
        await page.evaluate(() => window.browserSearch.getCount(
          'unknown',
        )
      );
      }
      catch(e) {
        expect(e.message).toMatchSnapshot();
      }
      
    })
  })
  
  describe('getItems', () => {

    beforeEach(async () => {
      await createStore();
      await addDataToStore();
    })

    describe('successes', () => {
      it('returns the items matching the ids', async () => {
        const results = await page.evaluate(({storeId, personsIds}) => window.browserSearch.getItems(
          storeId,
        )(personsIds), { storeId, personsIds: [persons[0].id, persons[2].id, persons[3].id] } as any
      );
    
        expect(results).toEqual([persons[0], persons[2], persons[3]]);
      })

      it('filters out items that do not exist', async () => {
        const results = await page.evaluate(({storeId, personsIds}) => window.browserSearch.getItems(
          storeId, 
        )(personsIds), { storeId, personsIds: [persons[0].id, 'giberrish']} as any
      );
    
        expect(results).toEqual([persons[0]]);
      })
    })

    describe('failures', () => {
      it('returns an error when the store does not exist', async () => {
        try {
          const results = await page.evaluate(({storeId, personsIds}) => window.browserSearch.getItems(
            storeId, 
            )(personsIds), { storeId: 'unknown', personsIds: [persons[0].id]} as any
          );
        }
        catch(e) {
          expect(e).toMatchSnapshot();
        }
      })
    })
  })

  describe('deleteStore', () => {

    beforeEach(async () => {
      await createStore();
    })

    describe('successes', () => {
      it('deletes the given store', async () => {
        await page.evaluate(({storeId}) => window.browserSearch.deleteStore(storeId),
          {storeId} as any
        );
    
        const doesStoreExist = await page.evaluate(({storeId}) => window.browserSearch.doesStoreExist(storeId),
        {storeId} as any
        );
        expect(doesStoreExist).toBe(false);
      })
    })

    describe('failures', () => {
      it('returns an error when the store to delete does not exist', async () => {
        try {
          await page.evaluate(() => window.browserSearch.deleteStore('unknown'));
        }
        catch(e) {
          expect(e.message).toMatchSnapshot();
        }
      })
    })

  })

  describe('deleteStoreIfExist', () => {

    beforeEach(async () => {
      await createStore();
    })

    it('deletes the given store', async () => {
      await page.evaluate(({storeId}) => window.browserSearch.deleteStoreIfExist(storeId),
        {storeId} as any
      );
  
      const doesStoreExist = await page.evaluate(({storeId}) => window.browserSearch.doesStoreExist(storeId),
      {storeId} as any
      );
      expect(doesStoreExist).toBe(false);
    })

    it('does nothing if the store does not exist', async () => {
      const result = await page.evaluate(() => window.browserSearch.deleteStoreIfExist('unknown'));
      expect(result).resolves
    })

  })

  describe('deleteDatabase', () => {

    beforeEach(async () => {
      await createStore();
    })

    it('deletes all the stores', async () => {
      await page.evaluate(() => window.browserSearch.deleteAllStores());
  
      const doesStoreExist = await page.evaluate(({storeId}) => window.browserSearch.doesStoreExist(storeId),
      {storeId} as any
      );
      expect(doesStoreExist).toBe(false);
    })

  })

  afterAll(async () => {
    await page.close();
    await browser.close();
  })
})

