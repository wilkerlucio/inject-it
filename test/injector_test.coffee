Injector = require('../lib/injector.coffee')

{expect} = require('chai')
sinon = require('sinon')

describe "Injector", ->
  class Service
    constructor: (@name) ->

    hello: => "Hello #{@name}"

  injector = null

  beforeEach ->
    injector = new Injector()

  it "raises an error when trying to get an undefined dependency", ->
    expect(-> injector.get('dep')).throw("Dependency 'dep' is not defined")

  it "stores and reads a value", ->
    injector.value('name', 'user')

    expect(injector.get('name')).eq 'user'

  it "can inject dependencies on function calls", ->
    injector.value('name', 'user')

    fn = (name) -> "Hello #{name}"

    expect(injector.call(fn)).eq 'Hello user'

  it "can construct dependencies for classes", ->
    injector.value('name', 'user')

    expect(injector.construct(Service).hello()).eql "Hello user"

  it "inject the arguments on factory initialization", ->
    factory = (name) -> "Hello #{name}"

    injector.value('name', 'user')
    injector.factory('myfac', factory)

    expect(injector.get('myfac')).eql 'Hello user'

  it "only calls the factory once, and only after first request", ->
    callCount = 0

    factory = (name) ->
      callCount += 1
      "Hello #{name}"

    injector.factory('myfac', factory)
    injector.value('name', 'user')

    expect(callCount).eq 0

    injector.get('myfac')
    injector.get('myfac')

    expect(callCount).eq 1

  it "correctly load and initialize services", ->
    injector.value('name', 'user')
    injector.service('myserv', Service)

    expect(injector.get('myserv').hello()).eql 'Hello user'
