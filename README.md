fortytwo-js
==============

Javascript package for the API provided by [42 Education](https://42education.com).

*Copyright &copy; 2015, 42 Education.*

Installation
------------

You can install the package using Bower:

```shell
bower install fortytwo-js --save
```

Or using npm:

```shell
npm install fortytwo-js --save
```

Or download *fortytwo.js* from Github.

Usage
-----
Include fortytwo.js in your application.

```html
<script src="components/fortytwo-js/fortytwo.js"></script>
```

Then initialize the object with the basic configuration:

```js
var FortyTwo = new FortyTwo (
  {
    url: "http://0.0.0.0:3000/",
    client_id: "",
    client_secret: "",
    redirect_uri: null
  }
);
```

Now you can start using the library:

```js
FortyTwo.Account; // return object with account status and/or details
FortyTwo.Account.signUp(params); // sign up for a new account
FortyTwo.Account.signIn(username, password); // log in to an existing account
FortyTwo.Account.signOut(); // log out of account
FortyTwo.Account.update(params); // remove account
FortyTwo.Account.remove(); // remove account

FortyTwo.Unit.getAssigned(function(units) {}); // find units that are assigned to this user
FortyTwo.Unit.find(params, function(units) {}); // find units
FortyTwo.Unit.findOne(params, function(unit) {}); // find a unit
FortyTwo.Unit.findById(id, function(unit) {}); // find a specific unit by id
FortyTwo.Unit.add(params); // add a unit
FortyTwo.Unit.update(params); // edit a unit
FortyTwo.Unit.remove(params); // remove a unit

FortyTwo.Statement.send(action, object_id); // send a statement
FortyTwo.Statement.find(params, function(statements) {}); // find statements
```

Feedback
------

For any questions, bug reports, feature requests or anything else, do reach out to us! We're available at [support@42education.com](mailto:support@42education.com).

License
----

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

