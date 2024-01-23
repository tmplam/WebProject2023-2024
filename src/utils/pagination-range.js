function getRange(start, end) {
    let range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}

module.exports = {
    paginationRange: (page, totalPage, siblings) => {
        const totalPageNoInArray = 7 + siblings;
        if (totalPage <= totalPageNoInArray) {
            return getRange(1, totalPage);
        }

        const leftSiblingsIndex = Math.max(page - siblings, 1);
        const rightSiblingsIndex = Math.min(page + siblings, totalPage);

        const showLeftDots = leftSiblingsIndex > 2;
        const showRightDots = rightSiblingsIndex < totalPage - 2;

        if (!showLeftDots && showRightDots) {
            const leftItemsCount = 3 + 2 * siblings;
            const leftRange = getRange(1, leftItemsCount);
            return [...leftRange, '...', totalPage];
        } else if (showLeftDots && !showRightDots) {
            const rightItemsCount = 3 + 2 * siblings;
            const rightRange = getRange(totalPage - rightItemsCount + 1, totalPage);
            return [1, '...', ...rightRange];
        } else {
            const middleRange = getRange(leftSiblingsIndex, rightSiblingsIndex);
            return [1, '...', ...middleRange, '...', totalPage];
        }
    },
};
