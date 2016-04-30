recreio-js
==============

JS package for the API provided by [recre.io](https://recre.io).

Installation
------

You can install the package using Bower:

```shell
bower install recreio-js --save
```

Or you can download *dist/recreio.js* from Github.

Usage
------
Include recreio.js in your application.

```html
<script src="bower_components/recreio-js/dist/recreio.js"></script>
```

Then initialize the object with the basic configuration:

```js
var client = new RecreIO.Client(apiKey);
```

Now you can use the library to implement authentication, using:

```js
client.signInWithUsername(username, password); // sign in using a username and password combination
client.getAccount(); // return your account profile
```

Now, you can retrieve the next exercies for this user by specifying the template you wish to receive and whether sound is enabled. Once you have received this exercise, you can begin the exercise and it will start collecting data accordingly. After the user has entered an answer, you can check the result and send a boolean value to recreio.

```js
client.getNextExercise(template, soundEnabled).then(function(exercise) {
  exercise.begin();
  // wait for user input
  exercise.save(result);
});
```

Achievements
--------

```js
// Initially, you should retrieve all achievements,
// to ensure that all relevant data is already loaded.
client.achievements().bind(this).then((achievements: RecreIO.Achievement[]) => {
  var sampleAchievement = achievements.get(1); // retrieve achievement by id = 1
  sampleAchievement.reveal(); // reveal the achievement
  sampleAchievement.complete(); // complete the achievement

  sampleAchievement.increment(1); // increment the completed steps by 1
});
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
