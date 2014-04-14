(function () {
    var trim = function(word) { return word.replace(/^\s+|\s+$/g, ''); };
    var FN_ARGS_REGEXP = /^function\s?\w*\((.+?)\)/;

    function Injector() {
        var _this = this;

        this.get = function () { return Injector.prototype.get.apply(_this, arguments); };

        this.deps = {};
    }

    Injector.readArguments = function (fn) {
        var string = fn.toString();

        if (matches = string.match(FN_ARGS_REGEXP))
            return matches[1].split(',').map(trim);
        else
            return [];
    };

    Injector.prototype.get = function (name) {
        this._guardDependencyRead(name);

        return this.deps[name];
    };

    Injector.prototype.set = function (name, value) {
        if (typeof this.deps[name] !== 'undefined')
            throw new Error("Dependency " + name + " is already set");

        this.deps[name] = value;
    };

    Injector.prototype.override = function (name, value) {
        this._guardDependencyRead(name);

        this.deps[name] = value;
    };

    Injector.prototype.call = function (fn) { return fn.apply(fn, this._readArguments(fn)); };

    Injector.prototype.construct = function (klass) {
        var deps = this._readArguments(klass);

        var tmp = function (args) { return klass.apply(this, args); };
        tmp.prototype = klass.prototype;

        return new tmp(deps);
    };

    Injector.prototype._readArguments = function (fn) {
        return Injector.readArguments(fn).map(this.get);
    };

    Injector.prototype._guardDependencyRead = function (name) {
        if (typeof this.deps[name] === 'undefined')
            throw new Error("Dependency " + name + " is not defined");
    };

    module.exports = Injector;
})();