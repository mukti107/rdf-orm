"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    baseUrl: '',
    username: '',
    password: ''
};
exports.initConnection = function (conf) {
    Object.assign(exports.config, conf);
};
exports.axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json,*/*;q=0.9'
    }
};
exports.default = exports.config;
