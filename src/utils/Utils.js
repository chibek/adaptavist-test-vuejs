export const orderDirectionFunction = orderDirection => {
    switch (orderDirection) {
        case '':
            return 'asc';
        case 'asc':
            return 'desc';
        case 'desc':
            return 'asc';
        default:
            return '';
    }
};
export const sortTable = (rows, key, orderDirection) => {
    return rows.sort((itemA, itemB) => {
        if (itemA[key] > itemB[key]) {
            return orderDirection === 'desc' ? -1 : 1;
        } else if (itemA[key] < itemB[key]) {
            return orderDirection === 'desc' ? 1 : -1;
        }
        return 0;
    });
};
