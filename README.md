fortytwo-js
==============

Javascript package for the API provided by [42 Education](https://42education.com).

*Copyright &copy; 2015, 42 Education.*

Installation
------------

You can install the package using Bower:

```
bower install fortytwo-js --save
```

Or download *fortytwo.js* from Github.

Usage
-----
Include fortytwo.js in your application.

```html
<script src="components/fortytwo-js/fortytwo.js"></script>
```

Then initialize the user object:

```js
var FortyTwo = new FortyTwo (
  {
    url: "http://0.0.0.0:3000/",
    client_id: "FaQg1U6Krm",
    client_secret: "914acd359adc4dc968aa433cbc4ac6c5a3a48b7bade6b4512550a77df5fac651c4d0d272d2a08d03ce9088cb18265ba1",
    redirect_uri: null
  }
);

FortyTwo.account; // return object with account status and/or details
FortyTwo.account.signup(params); // sign up for a new account
FortyTwo.account.login(username, password); // log in to an existing account
FortyTwo.account.logout(); // log out of account

FortyTwo.units.get(params, function(units) {}); // find units
FortyTwo.units.getAssigned(, function(units) {}); // find units that are assigned to this user
FortyTwo.unit.get(id, function(unit) {}); // find a specific unit by id

FortyTwo.statements.send(params); // send a statement
FortyTwo.statements.get(params, , function(statements) {}); // find statements
```

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

