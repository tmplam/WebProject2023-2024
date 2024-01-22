

const isEmpty = (obj) => {
    if (obj === null || obj === undefined) return true;

    const values = Object.values(obj);
    return (
        (Object.keys(obj).length === 0 && obj.constructor === Object) ||
        values.every((x) => x === null || x === undefined)
    );
};

module.exports = { isEmpty }