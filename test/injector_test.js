Injector = require("../injector")

var expect = require('chai').expect;

describe("Injector", function() {
    var injector = null;

    beforeEach(function () {
        injector = new Injector();
    })

    describe("getting and setting dependencies", function() {
        it("raises an error when try to get an undefined dependency", function() {
            expect(function () { injector.get('dep') }).throw(/Dependency dep is not defined/);
        });

        it("can set and get dependencies", function() {
            injector.set('dep', 'value');

            expect(injector.get('dep')).eq('value');
        });

        it("raises an error if the dependency is already set", function() {
            injector.set('dep', 'value');

            expect(function () { injector.set('dep', 'somethingElse'); }).throw(/Dependency dep is already set/)
        });

        it("can override dependency using override", function() {
            injector.set('dep', 'value');
            injector.override('dep', 'other');

            expect(injector.get('dep')).eq('other');
        });

        it("raises an error if you try to override an undefined dependency", function() {
            expect(function() { injector.override('dep', 'somethingElse'); }).throw(/Dependency dep is not defined/)
        });
    });

    describe("injecting stuff", function() {
        describe("reading function arguments", function() {
            it("returns a blank list when the function has no arguments", function() {
                var myFunction = function () { };

                expect(Injector.readArguments(myFunction)).eql([]);
            });

            it("returns the arguments name list", function() {
                var myFunction = function (some, args) { };

                expect(Injector.readArguments(myFunction)).eql(['some', 'args']);
            });
        });

        describe("injecting functions", function() {
            it("injects the dependencies by it's names", function() {
                injector.set('someDep', 'value');

                var fn = function (someDep) { return someDep + ' hello'; }

                expect(injector.call(fn)).eq('value hello');
            });

            it("can inject constructors", function() {
                var SomeClass = function (myDep) {
                    this.myDep = myDep;
                };

                SomeClass.prototype.doSomething = function () { return this.myDep + ' called'; };

                injector.set('myDep', 'dep');

                var obj = injector.construct(SomeClass);

                expect(obj.doSomething()).eq('dep called');
            });
        });
    });
});