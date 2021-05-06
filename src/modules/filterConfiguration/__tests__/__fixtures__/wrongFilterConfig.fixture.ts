export const emptyFilterConfigFixture: any = [
];

export const emptyGroupOfFiltersFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 }, 
    ],
    [ 
    ]
];

export const invalidOperatorFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: '.....', operand: 200 }, 
    ],
];

export const invalidFieldFixture: any = [
    [ 
        { id: 'priceMin', field: 2, operator: 'gt', operand: 200 }, 
    ],
];

export const invalidIdFixture: any = [
    [ 
        { id: 33, field: 'price', operator: 'gt', operand: 200 }, 
    ],
];

export const missingIdFixture: any = [
    [ 
        { field: 'price', operator: 'gt', operand: 200 }, 
    ],
];

export const missingFieldFixture: any = [
    [ 
        { id: 'priceMin', operator: 'gt', operand: 200 }, 
    ],
];

export const missingOperatorFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operand: 200 }, 
    ],
];

export const nonUniqueIdsFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 }, 
    ],
    [ 
        { id: 'priceMin', field: 'price', operator: 'lt', operand: 100 }, 
    ],
];
