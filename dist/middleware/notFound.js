"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
};
exports.default = notFound;
