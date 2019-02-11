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
var velocity = 5;
var torpedoCount = 10;

// DOM elements
var startBtn = document.querySelector("#start");
var audioBtn = document.querySelector("#audio");
var fireBtn = document.querySelector("#fire");
var introScreen = document.querySelector("#introScreen");
var gameScreen = document.querySelector("#gameScreen");
var gameInfo = document.querySelector("#torpedo-count");

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
    const src = "../audio/" + fn + ".mp3";

    // if audio is playing, stop it first
    if (SOUNDS[fn] !== null) {
        SOUNDS[fn].pause();
        SOUNDS[fn] = null;
    }

    // create audio element and set src
    const audio = document.createElement("audio");
    audio.src = src;

    // volume setting
    audio.volume = (fn === "explosion" ? 0.99 : 0.5);

    if (allowSound) {
        // set SOUNDS element = audio and play
        SOUNDS[fn] = audio;
        audio.play();
    }

    // create event listener for when audio ends
    audio.addEventListener("ended", doneAudio);

}

function startGameHandler() {
    // Hide the intro screen, show the game screen
    introScreen.style.display = "none";
    gameScreen.style.display = "block";
    rocket.img.style.display = "block";
    ufo.img.style.visibility = "visible";
    torpedo.img.style.visibility = "hidden";
    explosion.iframe.frameBorder = 0;
}

function impact(elem1, elem2) {
    const rec1 = elem1.getBoundingClientRect();
    const rec2 = elem2.getBoundingClientRect();

    return (rec1.left < rec2.right) &&
          ((rec1.top > rec2.bottom && rec1.top < rec2.top) ||
           (rec1.bottom > rec2.top && rec1.bottom < rec2.bottom));
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
        const range = (torpedo.x < 200 ? torpedo.x : 200);
        window.alert(range);
        torpedo.img.style.left = (torpedo.x - range) + "px";

        // update avaiable torpedos
        torpedoCount = torpedoCount - 1;
        gameInfo.innerHTML = "PHOTON TORPEDOES: " + torpedoCount;

        // after torpedo finishes, check for impact
        window.setTimeout(checkForHit, 1000);
        window.setTimeout(hideTorpedo, 1200);
    }
}

function showTorpedoHandler() {
    torpedo.img.style.visibility = "visible";
    fireTorpedoHandler();
}

function render() {
    // keep objects on screen
    if (rocket.x < 0) { rocket.x = 0; }
    if (rocket.y < 76) { rocket.y = 76; }
    if (rocket.x > 502) { rocket.x = 502; }
    if (rocket.y > 402) { rocket.y = 402; }
    if (ufo.y < 70) { ufo.y = 70; }
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
    if (event.keyCode === UP) {
        rocket.y -= velocity;
    } else if (event.keyCode === LEFT) {
        rocket.x -= velocity;
    } else if (event.keyCode === DOWN) {
        rocket.y += velocity;
    } else if (event.keyCode === RIGHT) {
        rocket.x += velocity;
    } else if (event.key === UFOUP) {
        ufo.y -= velocity;
    } else if (event.key === UFODOWN) {
        ufo.y += velocity;
    }

    render();
}

// Initialize objects on the screen
// window.addEventListener("load", init, false);
startBtn.addEventListener("click", startGameHandler, false);
fireBtn.addEventListener("click", showTorpedoHandler, false);
audioBtn.addEventListener("click", toggleSound, false);
window.addEventListener("keydown", keydownHandler, false);
explosion.iframe.src = "";

render();
