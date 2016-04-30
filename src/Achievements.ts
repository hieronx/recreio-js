/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class Achievements {

    private achievements: RecreIO.Achievement[] = [];

    private achievementPromise: any;

    constructor(private client: RecreIO.Client) {
      this.client.sendRequest('GET', 'achievements').then((body: string) => {
        var achievements = JSON.parse(body);

        for(var i = 0; i < achievements.length; i++) {
            this.achievements.push(new RecreIO.Achievement(this.client, achievements[i]));
        }
      }).catch((error) => {
        console.error('Failed to retrieve the achievements');
      });

      return this;
    }

    public get = (achievementId: number): RecreIO.Achievement => {
      var results = this.achievements.filter((achievement: RecreIO.Achievement) => { return achievement.id == achievementId });
      if (results[0]) return results[0];
      else return null;
    }

  }

  export class Achievement {

    public id: number;
    public applicationId: number;
    public name: string;
    public description: string;
    public order: number;
    public published: boolean;
    public points: number;
    public isIncremental: boolean;
    public totalSteps: number;

    private completed: boolean = false;
    private achievementSound = new Audio('http://offerijns.nl/AchievementUnlocked.mp3');

    constructor(private client: RecreIO.Client, private achievement: RecreIO.Achievement) {
      for (var k in achievement) this[k] = achievement[k];
      delete this.achievement;
    }

    public complete = () => {
      if (!this.completed) {
        this.completed = true;
        this.achievementSound.play();

        this.updateState('completed');

        // add inline css
        document.head.insertAdjacentHTML('beforeend', '<style>.notification { transition: opacity 1s ease-in-out; position: relative; bottom: 120px; margin: 0 auto; z-index: 9999; width: 260px; box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1), 0px 8px 8px 0px rgba(0, 0, 0, 0.07), 0px 16px 8px -8px rgba(0, 0, 0, 0.06); background: rgba(51, 51, 51, 0.9); border-radius: 8px; height: 80px; } .notification img { height: 40px; width: 40px; display: inline-block; padding: 20px; float: left; } .notification .content { display: inline-block; padding: 0 20px 0 0; width: 160px; } .notification .content h2 { font-size: 11px; font-family: Arial, sans-serif; color: #ccc; text-transform: uppercase; letter-spacing: .05em; margin-top: 0; width: 160px; padding: 20px 10px 0 0; float: left; } .notification .content h3 { font-family: Arial, sans-serif; font-weight: normal; margin: 5px 0; color: white; }</style>');

        // add achievement element
        document.body.insertAdjacentHTML('beforeend', '<div class="notification notification-achievement" id="last-achievement" style="opacity: 0;"><img src="http://offerijns.nl/achievement-icon.png" alt=""><div class="content"><h2>Achievement unlocked</h2><h3>' + this.name + '</h3></div></div>');

        // fade in now, fade out after 3s
        document.getElementById('last-achievement').style.opacity = '1';
        setTimeout(function(){ document.getElementById('last-achievement').style.opacity = '0'; }, 3000);
        setTimeout(function(){ document.getElementById('last-achievement').outerHTML = ''; }, 4000);
      }
    }

    private updateState = (newState: string = 'completed') => {
      return this.client.sendRequest('PUT', 'users/me/achievements/' + this.id + '/state', newState, {}, 'text/plain');
    }

  }

}
