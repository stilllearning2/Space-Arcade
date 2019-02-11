/*global window: false */
/*global document: false */
/*jslint node: true */
"use strict";

// Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;
var UFOUP = "w";
var UFODOWN = "z";

// variables
var velocity = 2;
var dilithium = 100;
var torpedoCount = 10;
var moves = 0;
var rand;
var UFOMIN = 98;

// DOM elements
var startBtn = document.querySelector("#start");
var audioBtn = document.querySelector("#audio");
var fireBtn = document.querySelector("#fire");
var slowerBtn = document.querySelector("#slower");
var fasterBtn = document.querySelector("#faster");
var introScreen = document.querySelector("#introScreen");
var gameScreen = document.querySelector("#gameScreen");
var dilithiumLvl = document.querySelector("#dilithiumLvl");
var torpedoLvl = document.querySelector("#torpedo-count");
var level = document.querySelector("#level");

// rocket object
var rocket = {
        img: document.querySelector("#rocket"),
        x: 490,
        y: 390,
        width: 100
    };

// ufo object
var ufo = {
        img: document.querySelector("#ufo"),
        x: 0,
        y: 66,
        width: 100
    };

// torpedo object
var torpedo = {
        img: document.querySelector("#torpedo"),
        x: 490,
        y: 383,
        width: 100
    };

// explosion object
var explosion = {
        iframe: document.querySelector("#explosion"),
        x: 10,
        y: 0,
        width: 100
    };

// audio elements
var SOUNDS = {
    "tos-photon-torpedo-1": null,
    "explosion": null
};

var allowSound = true;
var fn;

// audio functions
function toggleSound() {
    allowSound = !allowSound;
}

function doneAudio() {
    SOUNDS[fn].pause();
    SOUNDS[fn] = null;
}

function playSound(soundObj) {
    // set fn and src variables
    fn = soundObj;
    var src = "../audio/" + fn + ".mp3";

    // if audio is playing, stop it first
    if (SOUNDS[fn] !== null) {
        SOUNDS[fn].pause();
        SOUNDS[fn] = null;
    }

    // create audio element and set src
    var audio = document.createElement("audio");
    audio.src = src;

    // volume setting
    audio.volume = (fn === "explosion" ? 0.99 : 0.1);

    if (allowSound) {
        // set SOUNDS element = audio and play
        SOUNDS[fn] = audio;
        audio.play();
    }

    // create event listener for when audio ends
    audio.addEventListener("ended", doneAudio);
}

function impact(elem1, elem2) {
    var rec1 = elem1.getBoundingClientRect();
    var rec2 = elem2.getBoundingClientRect();

    return (rec1.left < rec2.right) &&
          ((rec1.bottom > rec2.top && rec1.bottom < rec2.bottom) ||
           (rec1.top > rec2.top && rec1.top < rec2.bottom));
}

function hideExplosion() {
    explosion.iframe.src = "";
}

function checkForHit() {
    // check for hit
    if (impact(torpedo.img, ufo.img)) {
        // play explosion
        playSound("explosion");

        // display explosion
        explosion.iframe.src = "https://giphy.com/embed/ahza0v6s5pSxy";

        // hide torpedo, ufo
        torpedo.img.style.visibility = "hidden";
        ufo.img.style.visibility = "hidden";

        // hide explosion
        window.setTimeout(hideExplosion, 500);  // 5 seconds
    }
}

function hideTorpedo() {
    torpedo.img.style.visibility = "hidden";
}

function playTorpedo() {
    playSound("tos-photon-torpedo-1");
}

function fireTorpedoHandler() {
    // Fire the photon torpedo!
    // CSS animation occurs whenever torpedo
    // 'left' property changes value
    if (torpedoCount > 0) {
        playTorpedo();
        // calculate max range
        var range = (torpedo.x - 25 < 200 ? torpedo.x - 25 : 200);
        torpedo.img.style.left = (torpedo.x - range) + "px";

        // update avaiable torpedos
        torpedoCount = torpedoCount - 1;
        torpedoLvl.innerHTML = "PHOTON TORPEDOES: " + torpedoCount;

        // after torpedo finishes, check for impact
        window.setTimeout(checkForHit, 1000);
        window.setTimeout(hideTorpedo, 1200);
    }
}

function showTorpedoHandler() {
    torpedo.img.style.visibility = "visible";
    fireTorpedoHandler();
}

function updateLevel() {
    var lvl = velocity - 1;
    level.innerHTML = "Level: " + lvl;
}

function levelDownHandler() {
    if (velocity > 0) {
        velocity = velocity - 1;
        updateLevel();
    }
}

function levelUpHandler() {
    velocity = velocity + 1;
    updateLevel();
}

function render() {
    // keep objects on screen
    if (rocket.x < 0) { rocket.x = 0; }
    if (rocket.y < 91) { rocket.y = 91; }
    if (rocket.x > 517) { rocket.x = 502; }
    if (rocket.y > 402) { rocket.y = 402; }
    if (ufo.y < UFOMIN) { ufo.y = UFOMIN; }
    if (ufo.y > 384) { ufo.y = 384; }
    if (torpedo.x < 0) { torpedo.x = 0; }
    torpedo.x = rocket.x;
    torpedo.y = rocket.y + 8;
    explosion.y = ufo.y - 20;
    // position objects on the screen
    rocket.img.style.left = rocket.x + "px";
    rocket.img.style.top = rocket.y + "px";
    ufo.img.style.top = ufo.y + "px";
    explosion.iframe.style.top = explosion.y + "px";
    torpedo.img.style.left = (torpedo.x) + "px";
    torpedo.img.style.top = (torpedo.y) + "px";
    torpedo.img.style.visibility = "hidden";
}

function keydownHandler(event) {
    // handle user keyboard input
    // check for ufo moves
    if (event.key === UFOUP) {
        ufo.y -= velocity;
    } else if (event.key === UFODOWN) {
        ufo.y += velocity;
    } else if (event.keyCode === UP ||
               event.keyCode === LEFT ||
               event.keyCode === DOWN ||
               event.keyCode === RIGHT) {
        // check for rocket moves
        if (event.keyCode === UP) {
            rocket.y -= velocity;
        } else if (event.keyCode === LEFT) {
            rocket.x -= velocity;
        } else if (event.keyCode === DOWN) {
            rocket.y += velocity;
        } else if (event.keyCode === RIGHT) {
            rocket.x += velocity;
        }

        // each move decreases
        // dilithium by velocity
        dilithium = dilithium - velocity / 8.0;
        dilithiumLvl.innerHTML =
            "Dilithium fuel: " + dilithium + "%";

        // move ufo
        // every five moves, recalc direction
        if (moves % 10 === 0) {
            if (ufo.y === UFOMIN) {
                rand = false;
            } else {
                rand = Math.random() >= 0.5;
            }
        }

        // move each turn
        if (rand === true) {
            ufo.y -= velocity;
        } else {
            ufo.y += velocity;
        }
        moves = moves + 1;
    }

    render();
}

function startGameHandler() {
    // Hide the intro screen, show the game screen
    intdisplay = "none";
    gameScreen.style.visibility = "hidden";
    rocket.img.style.display = "block";
    ufo.img.style.visibility = "visible";
    torpedo.img.style.visibility = "hidden";
    explosion.iframe.frameBorder = 0;
    explosion.iframe.style.visibility = "hidden";

    render();
}

function init() {
    // Initialize objects on the screen
    fireBtn.addEventListener("click", showTorpedoHandler, false);
    slowerBtn.addEventListener("click", levelDownHandler, false);
    fasterBtn.addEventListener("click", levelUpHandler, false);
    audioBtn.addEventListener("click", toggleSound, false);

    render();
}

window.addEventListener("load", init, false);
startBtn.addEventListener("click", startGameHandler, false);
