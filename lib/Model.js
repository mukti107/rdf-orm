"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Builder_1 = require("./Builder");
var TripletHelper_1 = require("./TripletHelper");
var Model = /** @class */ (function () {
    function Model() {
        this.table = 'default';
        this.id = Math.floor(Math.random() * 1000000000000000000000);
        this.values = {};
        return new Proxy(this, {
            get: function (self, field) { return self[field] || self.values[field] || null; },
            set: function (self, field, value) {
                if (self.hasOwnProperty(field))
                    self[field] = value;
                else
                    self.values[field] = value;
                return true;
            }
        });
    }
    Model.find = function (id) {
        var rec = new this;
        return rec.retrive(id);
    };
    Model.prototype.retrive = function (id) {
        var _this = this;
        this.id = id;
        return new Promise(function (resolve, reject) {
            var builder = new Builder_1.Builder(Builder_1.TYPE_QUERY);
            builder.setGraph(_this.table);
            builder.addCondition(TripletHelper_1.TripletHelper.create('id:' + id));
            builder.execute()
                .then(function (resp) {
                if (resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings) {
                    for (var _i = 0, _a = resp.data.results.bindings; _i < _a.length; _i++) {
                        var rec = _a[_i];
                        _this.values[builder.getValue(rec.p)] = builder.getValue(rec.o);
                    }
                }
                resolve(_this);
            })
                .catch(function (err) { return reject(err); });
        });
    };
    Model.all = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var rec = new _this;
            var builder = new Builder_1.Builder(Builder_1.TYPE_QUERY);
            builder.setGraph(rec.table);
            builder.addCondition(TripletHelper_1.TripletHelper.create());
            builder.execute()
                .then(function (resp) {
                var result = {};
                if (resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings) {
                    for (var _i = 0, _a = resp.data.results.bindings; _i < _a.length; _i++) {
                        var triplet = _a[_i];
                        var id = builder.getValue(triplet.s);
                        if (!result[id])
                            result[id] = { id: id };
                        result[id][builder.getValue(triplet.p)] = builder.getValue(triplet.o);
                    }
                }
                var mapped = Object.keys(result).map(function (id) {
                    var instance = new _this;
                    Object.assign(instance, result[id]);
                    return instance;
                });
                console.log(mapped);
                resolve(mapped);
            })
                .catch(reject);
        });
    };
    Model.prototype.save = function () {
        var builder = new Builder_1.Builder(Builder_1.TYPE_UPDATE);
        builder.addCondition(TripletHelper_1.TripletHelper.create());
        builder.setGraph(this.table);
        for (var key in this.values) {
            var removeTriplet = TripletHelper_1.TripletHelper.create('id:' + this.id, 'rel:' + key);
            builder.addRemoveTriplet(removeTriplet);
            var insertTriplet = TripletHelper_1.TripletHelper.create('id:' + this.id, 'rel:' + key, '"' + this.values[key] + '"');
            builder.addInsertTriplet(insertTriplet);
        }
        builder.execute();
    };
    Model.prototype.delete = function () {
        var builder = new Builder_1.Builder(Builder_1.TYPE_UPDATE);
        builder.addCondition(TripletHelper_1.TripletHelper.create());
        builder.setGraph(this.table);
        builder.addRemoveTriplet(TripletHelper_1.TripletHelper.create('id:' + this.id));
        return builder.execute();
    };
    return Model;
}());
exports.Model = Model;
exports.default = Model;
