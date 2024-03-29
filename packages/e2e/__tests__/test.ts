import 'expect-puppeteer';
import * as puppeteer from 'puppeteer';

import * as BrowserSearch from '../../../src';

import { indexConfig, keyPath, Person, persons, storeId } from './__fixtures__/personStore';

import type { FilterConfig } from '../../../src';
type FilterIds = 'lowAged' | 'middleAged' | 'highAged' | 'engineer' | 'red' | 'blue' | 'green';
const filterConfig: FilterConfig<Person, FilterIds> = [ 
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
  let browserSearch: typeof BrowserSearch;

  const createStoreRequest: BrowserSearch.CreateStoreRequest<Person> = {keyPath, indexConfig, storeId};
  const createStore = async () => {
    await page.evaluate((request: BrowserSearch.CreateStoreRequest<Person>) => browserSearch.createStore<Person>(request),
      createStoreRequest as any
    );
  }

  const addDocumentsToStoreRequest: BrowserSearch.AddDocumentsToStoreRequest<Person> = {documents: persons, storeId};
  const addDocumentsToStore = async () => {
    await page.evaluate((request: BrowserSearch.AddDocumentsToStoreRequest<Person>) => browserSearch.addDocumentsToStore(request),
    addDocumentsToStoreRequest as any
    );
  }

  beforeAll(async () => {
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
    await page.goto(process.env['TEST_URL'] as string);

    browserSearch = await page.evaluate(() => window.browserSearch);
    expect(browserSearch).toBeDefined();
  })

  afterEach(async () => {
    await page.evaluate(() => browserSearch.deleteAllStores());
  })

  describe('queryStore', () => {

    beforeEach(async () => {
      await createStore();
      await addDocumentsToStore();
    })

    describe('successes', () => {

      it('returns all items', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('performs a search with 1 filter', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['lowAged'],
            perPage: 100,
          })
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name DESC', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'DESC',
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC, gets the first 5 persons (page 0)', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            page: 0,
            perPage: 5,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('sorts by name ASC, gets the next 5 persons (page 1)', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            page: 1,
            perPage: 5,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })

      it('returns an empty array when the page is out of range', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: [],
            orderBy: 'name',
            orderDirection: 'ASC',
            page: 250,
            perPage: 5,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('search for the engineer profession', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['engineer'],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns empty array when no criteria is met', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['engineer', 'lowAged'],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red colour', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['red'],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red / blue / green colour', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['red', 'blue', 'green'],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })
    
      it('returns all people who like the red / blue / green colour AND are old', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['red', 'blue', 'green', 'highAged'],
            perPage: 100,
          });
          return results;
        }, { filterConfig, storeId } as any
        );
    
        expect(documents).toMatchSnapshot();
      })

      it('runs 2 concurrents searches', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [resultsA] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['red'],
            orderBy: 'name',
            orderDirection: 'ASC',
            perPage: 3,
          });
          const [resultsB] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig, 
            storeId,
            filtersApplied: ['blue'],
            orderBy: 'name',
            orderDirection: 'DESC',
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
          await page.evaluate(({filterConfig, storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
            const [results, abort] = browserSearch.queryStore<Person, FilterIds>({
              filterConfig, 
              storeId,
              filtersApplied: [],
              perPage: 5,
            });
            abort();
            return results;
          }, { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })

      it('returns an error when the filter config is undefined', async () => {
        try {
          await page.evaluate(({storeId}: Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'storeId'>) => browserSearch.queryStore<Person, FilterIds>({
            filterConfig: undefined as any,
            storeId,
            filtersApplied: [],
            page: 2,
            perPage: 5,
          }), { storeId }
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the store does not exist', async () => {
        try {
          await page.evaluate(({filterConfig}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig'>) => browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId: 'unknown',
            filtersApplied: [],
            page: 2,
            perPage: 5,
          }), { filterConfig } as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the filter to apply does not exist', async () => {
        try {
          await page.evaluate(({filterConfig, storeId}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId,
            filtersApplied: ['unknown' as any],
            page: 2,
            perPage: 5,
          }), { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
  
      it('returns an error when the page has the wrong format', async () => {
        try {
          await page.evaluate(({filterConfig, storeId}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId,
            filtersApplied: [],
            page: -5,
            perPage: 5,
          }), { filterConfig, storeId } as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
  
    })

    describe('cache', () => {
      it('retrieves the following queries with the same config from the cache', async () => {
        const documents = await page.evaluate(({filterConfig, storeId}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [resultsA] = browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId,
            filtersApplied: ['red'],
            orderBy: 'name',
            orderDirection: 'ASC',
            perPage: 2,
            page: 0,
          });

          const resultsB = resultsA.then( _ => {
            const [results] = browserSearch.queryStore<Person, FilterIds>({
              filterConfig,
              storeId,
              filtersApplied: ['red'],
              orderBy: 'name',
              orderDirection: 'DESC',
              perPage: 2,
              page: 1
            })
            return results;
          });

          return Promise.all([resultsA, resultsB]);
        }
        , { filterConfig, storeId } as any
        );
    
        expect((documents[0])['_cacheStatus_']).toBe('none');
        expect((documents[1])['_cacheStatus_']).toBe('partial');
      })

      it('does not retrieve the following queries from the cache if the store has changed', async () => {
        const documentsA = await page.evaluate(({filterConfig, storeId}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = 
          browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId,
            filtersApplied: ['red'],
            orderBy: 'name',
            orderDirection: 'ASC',
            perPage: 2,
            page: 0,
          })
          return results;
        }, { filterConfig, storeId } as any);

        await page.evaluate((request:  BrowserSearch.AddDocumentsToStoreRequest<Person>) => browserSearch.addDocumentsToStore(request),
        {documents: [{...persons[0], id: 'new', name: 'AAA'}], storeId});

        const documentsB = await page.evaluate(({filterConfig, storeId}:  Pick<BrowserSearch.QueryRequest<Person, FilterIds>, 'filterConfig' | 'storeId'>) => {
          const [results] = 
          browserSearch.queryStore<Person, FilterIds>({
            filterConfig,
            storeId,
            filtersApplied: ['red'],
            orderBy: 'name',
            orderDirection: 'ASC',
            perPage: 2,
            page: 0,
          })
          return results;
        }, { filterConfig, storeId } as any);
    
        expect((documentsA )['_cacheStatus_']).toBe('none');
        expect((documentsB )['_cacheStatus_']).toBe('none');
        expect(documentsA).toMatchSnapshot();
        expect(documentsB).toMatchSnapshot();
      })
    })

  })
  
  describe('createStore', () => {
    it('successfully creates the store', async () => {
      const results = await page.evaluate((request: BrowserSearch.CreateStoreRequest<Person>) => browserSearch.createStore<Person>(request),
        {keyPath, indexConfig, storeId} as any
      );
      const doesStoreExist = await page.evaluate((request: BrowserSearch.DoesStoreExistRequest) => browserSearch.doesStoreExist(request),
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
      const doesStoreExist = await page.evaluate((request: BrowserSearch.DoesStoreExistRequest) => browserSearch.doesStoreExist(request),
        {storeId}
      );

      expect(doesStoreExist).toBe(true);
    });

    it('returns false if the store does not exist', async () => {
      const doesStoreExist = await page.evaluate(() => browserSearch.doesStoreExist({storeId: 'unknown'}),
      );

      expect(doesStoreExist).toBe(false);
    });
  });

  describe('addDocumentsToStore', () => {

    beforeEach(async () => {
      await createStore();
    })

    describe('successes', () => {
      it('succeeds when the data is matching the store', async () => {

        await page.evaluate(
          (request: BrowserSearch.AddDocumentsToStoreRequest<Person>) => browserSearch.addDocumentsToStore(request)
          ,{ storeId, documents: persons } as any
        );
  
        const results = await page.evaluate(
          (request: BrowserSearch.GetDocumentsRequest) => browserSearch.getDocuments<Person>(request)
          ,{ storeId, documentIds: [persons[0].id] }
        );
  
        expect(results).toEqual([persons[0]]);
      });
    })
    
    describe('failures', () => {
      it('fails when the key already exists', async () => {
        try {
          
          await page.evaluate(
            (request: BrowserSearch.AddDocumentsToStoreRequest<Person>) => {
              browserSearch.addDocumentsToStore(request);
              browserSearch.addDocumentsToStore(request);
            }
            ,{ storeId, documents: [persons[0]]} as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
        
      });
  
      it('fails when the store does not exist', async () => {
        try {
          await page.evaluate(
            (request: BrowserSearch.AddDocumentsToStoreRequest<Person>) => browserSearch.addDocumentsToStore(request)
            ,{ documents: [persons[0]], storeId: 'unknown'} as any
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      });
    })
    
  });


  describe('getIndexValues', () => {
    
    beforeEach(async () => {
      await createStore();
      await addDocumentsToStore();
    })

    describe('successes', () => {
      it('returns all the colours available', async () => {
        const results = await page.evaluate((request: BrowserSearch.GetIndexValuesRequest) => browserSearch.getIndexValues(request), 
        { storeId, field: 'favoriteColours' }
      );
    
        expect(results).toMatchSnapshot();
      })
    
      it('returns all the countries available', async () => {
        const results = await page.evaluate((request: BrowserSearch.GetIndexValuesRequest) => browserSearch.getIndexValues(request), 
        { storeId, field: 'country' }
      );
    
        expect(results).toMatchSnapshot();
      })
    })

    describe('failures', () => {
      it('fails when the property is not indexed', async () => {
        try {
          await page.evaluate((request: BrowserSearch.GetIndexValuesRequest) => browserSearch.getIndexValues(request), 
          { storeId, field: 'unknown' }
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })

      it('fails when the store does not exist', async () => {
        try {
          await page.evaluate(() => browserSearch.getIndexValues({
            storeId: 'unknown',
            field: 'country',
          })
          );
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
    })
  })
  

  describe('getNumberOfDocumentsInStore', () => {

    beforeEach(async () => {
      await createStore();
      await addDocumentsToStore();
    })

    it('returns the number of items in the store', async () => {
      const results = await page.evaluate((request: BrowserSearch.GetNumberOfDocumentsInStoreRequest) => browserSearch.getNumberOfDocumentsInStore(
        request,
      ), { storeId }
     );
  
      expect(results).toBe(persons.length);
    })

    it('fails when the store does not exist', async () => {
      try {
        await page.evaluate(() => browserSearch.getNumberOfDocumentsInStore(
          {storeId: 'unknown'},
        )
      );
      }
      catch(e) {
        expect((e as Error).message).toMatchSnapshot();
      }
      
    })
  })
  
  describe('getDocuments', () => {

    beforeEach(async () => {
      await createStore();
      await addDocumentsToStore();
    })

    describe('successes', () => {
      it('returns the items matching the ids', async () => {
        const results = await page.evaluate((request: BrowserSearch.GetDocumentsRequest) => browserSearch.getDocuments(request),
         { storeId, documentIds: [persons[0].id, persons[2].id, persons[3].id] } as any
      );
    
        expect(results).toEqual([persons[0], persons[2], persons[3]]);
      })

      it('filters out items that do not exist', async () => {
        const results = await page.evaluate((request: BrowserSearch.GetDocumentsRequest) => browserSearch.getDocuments(request),
         { storeId, documentIds: [persons[0].id, 'giberrish']} as any
      );
    
        expect(results).toEqual([persons[0]]);
      })
    })

    describe('failures', () => {
      it('returns an error when the store does not exist', async () => {
        try {
          const results = await page.evaluate((request: BrowserSearch.GetDocumentsRequest) => browserSearch.getDocuments(request),
           { storeId: 'unknown', documentIds: [persons[0].id]} as any
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
        await page.evaluate((request: BrowserSearch.DeleteStoreRequest) => browserSearch.deleteStore(request),
          {storeId} as BrowserSearch.DeleteStoreRequest
        );
    
        const doesStoreExist = await page.evaluate((request: BrowserSearch.DoesStoreExistRequest) => browserSearch.doesStoreExist(request),
        {storeId} as BrowserSearch.DoesStoreExistRequest
        );
        expect(doesStoreExist).toBe(false);
      })
    })

    describe('failures', () => {
      it('returns an error when the store to delete does not exist', async () => {
        try {
          await page.evaluate(() => browserSearch.deleteStore({storeId: 'unknown'}));
        }
        catch(e) {
          expect((e as Error).message).toMatchSnapshot();
        }
      })
    })

  })

  describe('deleteStoreIfExist', () => {

    beforeEach(async () => {
      await createStore();
    })

    it('deletes the given store', async () => {
      await page.evaluate((request: BrowserSearch.DeleteStoreIfExistRequest) => browserSearch.deleteStoreIfExist(request),
        {storeId} as BrowserSearch.DeleteStoreIfExistRequest
      );
  
      const doesStoreExist = await page.evaluate((request: BrowserSearch.DeleteStoreIfExistRequest) => browserSearch.doesStoreExist(request),
      {storeId} as BrowserSearch.DeleteStoreIfExistRequest
      );
      expect(doesStoreExist).toBe(false);
    })

    it('does nothing if the store does not exist', async () => {
      const result = await page.evaluate(() => browserSearch.deleteStoreIfExist({storeId: 'unknown'}));
      expect(result).resolves
    })

  })

  describe('deleteAllStores', () => {

    beforeEach(async () => {
      await createStore();
    })

    it('deletes all the stores', async () => {
      await page.evaluate(() => browserSearch.deleteAllStores());
  
      const doesStoreExist = await page.evaluate((request: BrowserSearch.DoesStoreExistRequest) => browserSearch.doesStoreExist(request),
      {storeId} as BrowserSearch.DoesStoreExistRequest
      );
      expect(doesStoreExist).toBe(false);
    })

  })

  afterAll(async () => {
    await page.close();
    await browser.close();
  })
})

