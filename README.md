recreio-js
==============

The Javascript SDK for the [Recreio](https://recre.io) developer platform.

Recreio enables game developers to easily create games for the K12 education market. We provide content aligned to the school curriculum, user and group management, gamification features such as achievements and leaderboards, and a distribution platform on the web, iOS, Android and Chrome OS. This way, you can focus on creating a beautiful, engaging game that provides the best possible learning experience.

Installation
------

The SDK is available to install using Bower:

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

Currently, the Recreio app handles all authentication, so you should simply be able to retrieve the user profile after loading the app:

```js
client.getUser(); // return your profile
```

Content queries
----------

Now, you can retrieve the next exercies for this user, by using our Content Query Language. This can be as simple as requesting 10 true-false exercises, or can be as precise as requesting 3 groups of matching exercises, consisting of 5 items each, that can make use of sound and are timed.

```js
var content = client.content().template('true-false').get(10); // retrieve 10 true-false exercises
var content = client.content().template('matching').groupBy('item', 5).sound(true).timed(true).get(3); // retrieve 3 groups of 5 matching exercises

content.then(function(exercises) {
  var currentExercise = exercises[0];
  currentExercise.begin();
  // wait for user input
  currentExercise.save(result);
  currentExercise = currentExercise.next;
});
```

Achievements
--------

On preloading the game, you should retrieve the list of achievements, which you have added in the developer center. You can then complete specific achievements or increment them step-by-step.

```js
// Initially, you should retrieve all achievements,
// to ensure that all relevant data is already loaded.
client.achievements().then(function(achievements) {
  var sampleAchievement = achievements.get(1); // retrieve achievement by id = 1
  sampleAchievement.complete(); // complete the achievement
  sampleAchievement.increment(1); // increment the completed steps by 1
});
```

Leaderboards
--------

Now, you can set up leaderboards in our developer center and then use these to track highscores. We can then show leaderboards for your game in the Recreio application.

```js
// Retrieve leaderboard with id = 1 and submit a new highscore of 100
client.leaderboard(1).submitScore(100);
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
