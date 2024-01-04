module.exports = class CustomError extends Error {
    constructor(errorMessage, statusCode) {
        super();
        this.message = errorMessage;
        this.statusCode = statusCode;
    }
};
