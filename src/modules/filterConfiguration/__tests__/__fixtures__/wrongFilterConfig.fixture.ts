export const emptyFilterConfigFixture: any = [
];

export const emptyGroupOfFiltersFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 }, 
    ],
    [ 
    ]
];

export const incompleteFilterFixture: any = [
    [ 
        { field: 'price', operator: 'gt', operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: 'lt', operand: 500 }, 
    ],
];

export const invalidOperatorFixture: any = [
    [ 
        { field: 'price', operator: '.....', operand: 200 }, 
    ],
];