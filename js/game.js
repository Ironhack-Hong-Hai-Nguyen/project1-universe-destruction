class Game {

  constructor() {
    this.backgroundImage;
    this.starshipImg;
    this.imageDestroyer1;
    this.imageDestroyer2;
    this.imageBullet1;
    this.imageBullet2;
    // this.start = false;
    // if 2 players -> allow three lives for both of them
    this.lives = 1;
  }

  setup() {
    // use DOM to get the number of players - 1 or 2
    
    // create a list of players later

    this.destroyer = new Destroyer(WIDTH/2-50, HEIGHT-100, this.imageDestroyer1, this.imageBullet1);

    this.starships = [];
    this.objectTrack = [];
    // when starship appear alternatively in seconds - depend on level - interval
    // change later 
    this.durationStarship = 3;
    // number of starships appear at a time
    this.maxStarshipsApprear = 4;
    // the SetInterval
    this.interval;
    this.starshipGen();
    this.difficultyLevel = 1;
  }

  preload() {
    // Loading images - before starting the game

    // load shield
    this.shield = loadImage('assets/spaceships/shield.png');

    this.backgroundImage = loadImage('assets/background/space1.png');
    this.starshipImg = loadImage('assets/spaceships/starship.png');
    this.imageDestroyer1 = loadImage('assets/spaceships/destroyer1.png');
    this.imageDestroyer2 = loadImage('assets/spaceships/destroyer2.png');
    this.imageBullet1 = loadImage('assets/lasers/laserBlue.png'); 
    this.imageBullet2 = loadImage('assets/lasers/laserGreen.png');
  }


  draw() {
    // this.drawGrid();
    this.drawStarship();

    this.destroyer.draw();
    this.destroyer.multipleFires()

    this.starships = this.starships.filter(starship => {
      if (starship.getShot(this.destroyer)) {
        return false;
      }
      // starship passed -> your mother ship is going to be destroyed, your shield down
      if (starship.y > height + starship.sizeY) {
        this.destroyer.shield -= 2;
        return false;
      }

      if (starship.getHit(this.destroyer)) {
        return false;
      }
      return true;
    })

    this.shieldStatus(this.destroyer);
    this.levelUp(this.destroyer)

    if (this.destroyer.isLost()) {
      // performing stop here -> loose
    }
  }

  // starships generator -> can use to generate planet and stars
  starshipGen() {
    this.interval = setInterval(() => {
      let n = Math.floor(Math.random() * this.maxStarshipsApprear) + 1;
      let noStarships = 0;
      while(noStarships < n) {
        let starship = new Starship(this.starshipImg, this.difficultyLevel);
        if (!this.objectTrack.includes(starship.x)) {
          this.starships.push(starship);
          this.objectTrack.push(starship.x);
          noStarships++;
        }
      }
      // for (let i=0; i<n; i++) {

      //   this.starships.push(new Starship(this.starshipImg));
      // }
      this.objectTrack = []
    }, this.durationStarship * 1000);
  }

  drawStarship() {
    if (this.starships.length) {
      this.starships.forEach(starship => {
        starship.draw();
      })
    }
  }

  shieldStatus(destroyer) {
    image(this.shield, 10, 10, 50, 50);
    colorMode(RGB, 60);
    fill(255, 255, 255, 10);
    rect(60, 15, 120, 33);

    // turn red if shield < 40%
    if (destroyer.shield < 40) {
      fill(255, 0, 0);
    } else {
      fill(0, 143, 17);
    }

    rect(60, 15, destroyer.shield * 120/100, 33)
    // text
    fill(255, 165, 0, 100);
    textSize(28);
    textFont('Orbitron')
    textStyle(BOLD);
    // Center the text in the middle of the progress bar
    if (destroyer.shield === 100) {
      text(`${destroyer.shield}%`, 80, 41);
    } else if (destroyer.shield < 100 && destroyer.shield > 0) {
      text(`${destroyer.shield}%`, 95, 41);
    } else {
      text(`${destroyer.shield}%`, 105, 41);
    }
  }

  levelUp(destroyer) {
    let lvlScores = BASED_SCORE * 2** this.difficultyLevel;
    text(`LV ${this.difficultyLevel}:`, 240, 41);

    fill(255, 255, 255, 10);
    rect(325, 15, 120, 33);
    colorMode(RGB, 100);
    fill(255, 166, 77);
    rect(325, 15, destroyer.scores * 120/lvlScores, 33)
    
    colorMode(RGB, 60);
    fill(0, 128, 0);
    textSize(23);
    if (destroyer.scores > 999) {
      text(`${destroyer.scores}`, 352, 39);
    } else if (destroyer.scores < 1000 && destroyer.scores >= 100) {
      text(`${destroyer.scores}`, 355, 39);
    } else if (destroyer.scores < 100 && destroyer.scores >= 10) {
      text(`${destroyer.scores}`, 362, 39);
    } else {
      text(`${destroyer.scores}`, 375, 39);
    }

    if (destroyer.scores > lvlScores) {
      this.difficultyLevel++;
    }
  }

  keyPressed() {
    if (keyCode === 32) {
        this.destroyer.fireBullet();
    }
    if (keyCode === 38) {
      this.destroyer.moveUp();
    }
    if (keyCode === 40) {
      this.destroyer.moveDown();
    }
    if (keyCode === 37) {
      this.destroyer.moveLeft();
    }
    if (keyCode === 39) {
      this.destroyer.moveRight();
    }
  }
}