fortytwo-js
==============

Javascript package for the API provided by [42 Education](https://42education.com).

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
var FortyTwo = new FortyTwo(
  {
    url: "https://api.42education.com/",
    api_key: "abcdef"
  }
);
```

Now you can start using the library:

```js
FortyTwo.signIn(provider); // redirect to the sign in page of a SSO provider (e.g. Google, Facebook)
FortyTwo.signIn(username, password); // sign in using a username and password combination
FortyTwo.signOut(); // sign out of account

FortyTwo.settings[key]; // retrieve a user setting
FortyTwo.settings[key] = value; // create or update a user setting

FortyTwo.getNextUnit(); // get the next unit assigned to this user
FortyTwo.getAssignedUnits(); // get a list of all assigned units
FortyTwo.getUnitByID(unitId); // get a specific unit by its index

FortyTwo.beginUnit(unitId); // begin a specific unit
FortyTwo.saveObject(results); // save the results of this object and return the next object
FortyTwo.saveUnit(results); // save the results of this unit and return the next unit
FortyTwo.beginNextUnit(); // begin the next unit
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
