fortytwo-js
==============

JS package for the API provided by [42 Education](https://42education.com).

Installation
------

You can install the package using Bower:

```shell
bower install fortytwo-js --save
```

Or using npm:

```shell
npm install fortytwo-js --save
```

Or you can download *fortytwo.js* from Github.

Usage
------
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

Now you can use the library to implement authentication, using:

1. An external oAuth or SAML authentication provider, such as Google or Active Directory.

2. An username/email and password combination specifically used for the 42 Education platform.

```js
FortyTwo.signIn(provider); // redirect to the sign in page of a SSO provider (e.g. Google, Facebook)
FortyTwo.signIn(username, password); // sign in using a username and password combination
FortyTwo.getUserProfile(); // return your account profile
FortyTwo.signOut(); // sign out of account
```

You can then retrieve the first unit and start the learning activity by looping the learning objects as part of that unit. The set of learning objects is an ordered list (implemented as a linked list) and should be completed in that order only.

```js
var unitPromise = FortyTwo.getNextUnit(); // get the next unit assigned to this user
var unitPromise = FortyTwo.getUnit(unitId); // get a specific unit by its index

unitPromise.then(function(unit) {
  unit.begin();

  var learningObject = unit.first;
  do {
    learningObject.save(result);
    learningObject = learningObject.next;
  } while (learningObject.next !== null)

  unit.end();
});
```

To simplify development of custom features, you can store any kind of (JSON-based) data for your app and/or for the currently authenticated user.

```js
FortyTwo.appStorage.get(key); // retrieve an app setting
FortyTwo.appStorage.set(key, value); // create or update an app setting

FortyTwo.userStorage.get(key); // retrieve a user setting
FortyTwo.userStorage.set(key, value); // create or update a user setting
```

Feedback
------

For any questions, bug reports, feature requests or anything else, do reach out to us! We're available at [support@42education.com](mailto:support@42education.com).

License
------

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
