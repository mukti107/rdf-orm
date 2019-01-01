"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TripletHelper = /** @class */ (function () {
    function TripletHelper() {
    }
    TripletHelper.create = function (s, p, o) {
        if (s === void 0) { s = '?s'; }
        if (p === void 0) { p = '?p'; }
        if (o === void 0) { o = '?o'; }
        return [s, p, o];
    };
    return TripletHelper;
}());
exports.TripletHelper = TripletHelper;
