recreio-js
==============

JS package for the API provided by [recre.io](https://recre.io).

Installation
------

You can install the package using Bower:

```shell
bower install recreio-js --save
```

Or using npm:

```shell
npm install recreio-js --save
```

Or you can download *recreio.min.js* from Github.

Usage
------
Include recreio.js in your application.

```html
<script src="components/recreio-js/recreio.min.js"></script>
```

Then initialize the object with the basic configuration:

```js
var RecreIO = new RecreIO(
  {
    api_key: "abcdef"
  }
);
```

Now you can use the library to implement authentication, using:

1. An external oAuth or SAML authentication provider, such as Google or Active Directory.

2. An username/email and password combination specifically used for the 42 Education platform.

```js
RecreIO.signIn(provider); // redirect to the sign in page of a SSO provider (e.g. Google, Facebook)
RecreIO.signIn(username, password); // sign in using a username and password combination
RecreIO.getAccount(); // return your account profile
RecreIO.signOut(); // sign out of account
```

You can then retrieve the first unit and start the learning activity by looping the learning objects as part of that unit. The set of learning objects is an ordered list (implemented as a linked list) and should be completed in that order only.

```js
RecreIO.getNextExercise().then(function(exercise) {
  exercise.begin();
  // wait for user input
  exercise.save(result);
});
```

To simplify development of custom features, you can store any kind of (JSON-based) data for your app and/or for the currently authenticated user.

```js
RecreIO.userStorage.get(key); // retrieve a user setting
RecreIO.userStorage.set(key, value); // create or update a user setting

RecreIO.appStorage.get(key); // retrieve an app setting
RecreIO.appStorage.set(key, value); // create or update an app setting
```

Feedback
------

For any questions, bug reports, feature requests or anything else, do reach out to us! We're available at [support@recre.io](mailto:support@recre.io).

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
