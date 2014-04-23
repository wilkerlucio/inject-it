trim = (word) -> word.replace(/^\s+|\s+$/g, '')
FN_ARGS_REGEXP = /^function\s?\w*\((.+?)\)/

readArguments = (fn) ->
  string = fn.toString()

  if matches = string.match(FN_ARGS_REGEXP)
    trim(arg) for arg in matches[1].split(',')
  else
    []

identity = (x) -> x

lazyInitialize = (provider, initializer) ->
  cacheContainer = {}

  ->
    unless cacheContainer.hasOwnProperty('value')
      cacheContainer.value = initializer(provider)

    cacheContainer.value

module.exports = class Injector
  constructor: ->
    @deps = {}

  value: (name, value) => @deps[name] = lazyInitialize(value, identity); this

  factory: (name, factory) => @deps[name] = lazyInitialize(factory, @call); this

  service: (name, service) => @deps[name] = lazyInitialize(service, @construct); this

  get: (name) =>
    unless @deps.hasOwnProperty(name)
      throw new Error("Dependency '#{name}' is not defined")

    @deps[name]()

  call: (fn) => fn.apply(fn, @readArguments(fn))

  construct: (klass) =>
    deps = @readArguments(klass)

    tmp = (args) -> klass.apply(this, args)
    tmp.prototype = klass.prototype;

    new tmp(deps);

  readArguments: (fn) => @get(arg) for arg in readArguments(fn)
