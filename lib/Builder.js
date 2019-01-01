"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var config_1 = __importStar(require("./config"));
var Querystring = __importStar(require("querystring"));
exports.TYPE_UPDATE = "update";
exports.TYPE_QUERY = "query";
var Builder = /** @class */ (function () {
    function Builder(type) {
        if (type === void 0) { type = exports.TYPE_QUERY; }
        this.limit = -1;
        this.conditionsTriplets = [];
        this.insertTriplets = [];
        this.removeTriplets = [];
        this.selectTriplet = ['?s', '?p', '?o'];
        this.type = exports.TYPE_QUERY;
        this.graph = 'default';
        this.type = type;
    }
    Builder.prototype.getQueryString = function () {
        return ("\n        PREFIX rel:  <rel:>\n        PREFIX id: <id:>\n        " + (this.type === exports.TYPE_QUERY ? 'SELECT ' + this.tripletString(this.selectTriplet, '') + 'FROM <' + this.getGraph() + '> WHERE { ' + this.tripletsString(this.conditionsTriplets) + ' } ' + (this.limit > 0 ? "LIMIT " + this.limit : '') : '') + "\n        " + (this.type === exports.TYPE_UPDATE && this.removeTriplets.length > 0 ? 'WITH <' + this.getGraph() + '> DELETE {' + this.tripletsString(this.removeTriplets) + '} ' + 'WHERE { ' + this.tripletsString(this.conditionsTriplets) + ' };' : '') + "\n        " + (this.type === exports.TYPE_UPDATE && this.insertTriplets.length > 0 ? 'WITH <' + this.getGraph() + '> INSERT {' + this.tripletsString(this.insertTriplets) + '} ' + 'WHERE { ' + this.tripletsString(this.conditionsTriplets) + ' };' : '') + "\n        ").replace(/\n\s+/g, " ");
    };
    Builder.prototype.setLimit = function (limit) {
        this.limit = limit;
    };
    Builder.prototype.setGraph = function (graph) {
        this.graph = graph;
    };
    Builder.prototype.getGraph = function () {
        return config_1.default.baseUrl + '/' + this.graph;
    };
    Builder.prototype.addInsertTriplet = function (triplet) {
        this.insertTriplets.push(triplet);
    };
    Builder.prototype.addRemoveTriplet = function (triplet) {
        this.removeTriplets.push(triplet);
    };
    Builder.prototype.addCondition = function (triplet) {
        this.conditionsTriplets.push(triplet);
    };
    Builder.prototype.tripletsString = function (triplets) {
        var _this = this;
        return triplets.map(function (triplet) { return _this.tripletString(triplet); }).join(' ');
    };
    Builder.prototype.tripletString = function (triplet, delimeter) {
        if (delimeter === void 0) { delimeter = '.'; }
        var s = triplet[0], p = triplet[1], o = triplet[2];
        return s + " " + p + " " + o + " " + delimeter;
    };
    Builder.prototype.getEndpointInfo = function () {
        switch (this.type) {
            case exports.TYPE_UPDATE:
                return {
                    url: config_1.default.baseUrl + '/update',
                    paramName: 'update',
                    store: config_1.default.baseUrl + '/sample'
                };
            default:
                return { url: config_1.default.baseUrl + '/query', paramName: 'query' };
        }
    };
    Builder.prototype.execute = function () {
        var _a;
        var endpointInfo = this.getEndpointInfo();
        var data = (_a = {}, _a[endpointInfo.paramName] = this.getQueryString(), _a);
        console.log(data);
        return axios_1.default.post(endpointInfo.url, Querystring.stringify(data), config_1.axiosConfig);
        // .then(resp=>{
        //     const result:any = {};
        //     if(resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings){
        //         for(const rec of resp.data.results.bindings){
        //             const id = this.getValue(rec.s);
        //             if(!result[id]) result[id] = {};
        //             result[id][this.getValue(rec.p)] = this.getValue(rec.o);
        //         }
        //     }
        //     return result;
        // })
        // .catch((resp)=>console.log(resp.data))
        // ;
    };
    Builder.prototype.getValue = function (_a) {
        var type = _a.type, value = _a.value;
        if (type === 'uri') {
            var arr = value.split(':');
            return arr[1];
        }
        return value;
    };
    return Builder;
}());
exports.Builder = Builder;
