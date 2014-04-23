# Inject It

`Inject it` provides a simple and easy way to handle your Node.js application level dependencies.

## Installation

```
npm install -S inject-it
```

## Configuring the injector

The inject-it porpuse is to work like a simple flat map of your application dependencies, so, imagine that it's
just a hash with extra convenience, where you define your dependencies by name. While the name of the dependencies are
all strings, the values of dependencies can be whatever you want, instances, classes...

What we recommend is for you to have a file just for your injector configuration, so you can easly reuse it over your
application, here is a sample one:

`config/injector.js`
```javascript
var Injector = require('inject-it');

var injector = new Injector();

injector.value('injector', injector); // I found that having the injector itself as a dependency is very helpful

injector.value('User', require('../app/models/user'));
injector.value('SomeLib', require('../lib/some_lib'));

module.exports = injector;
```

## Using the injector

Once you have your injector configured, it's time to use it, let's start with the simplest way of reading dependencies,
that's by using the `get` method:

```javascript
var injector = require('./config/injector');

function doSomething() {
  var User = injector.get('User');

  var user = new User();
  user.sayHello();
}

doSomething();
```

Simple enough, right? And a notice, if you try to `get` a dependency that is not defined, an error with be raised.

The previous version works, but there is a more convenient way, that is to use the function argument names in order to
fetch the dependencies, see the next example:

```javascript
var injector = require('./config/injector');

function doSomething(User) {
  var user = new User();
  user.sayHello();
}

// this will read 'User' from the argument name and inject it automatically
injector.call(doSomething);
```

The cool thing about this is that you can just list your dependencies on the parameters (without even caring about the
order) and have them propertly injected at runtime.

If you need to construct an object (calling `new` instead of simple calling the function) you can use the `construct`
method:

```javascript
var injector = require('./config/injector');

function MyClass(User) {
  this.User = User;
}

MyClass.prototype.sayHello = function() {
  var user = new this.User();
  user.sayHello();
};

injector.construct(MyClass).sayHello();
```
