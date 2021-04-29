
export const emptyFilterConfig: any = [
];

export const emptyGroupOfFilters: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 }, 
    ],
    [ 
    ]
];

export const incompleteFilter: any = [
    [ 
        { field: 'price', operator: 'gt', operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: 'lt', operand: 500 }, 
    ],
];

export const invalidOperator: any = [
    [ 
        { field: 'price', operator: '.....', operand: 200 }, 
    ],
];