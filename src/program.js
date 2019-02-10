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

// Velocity
var velocity = 5;

// DOM elements
var startBtn = document.querySelector("#start");
var audioBtn = document.querySelector("#audio");
var fireBtn = document.querySelector("#fire");
var introScreen = document.querySelector("#introScreen");
var gameScreen = document.querySelector("#gameScreen");

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
        x: 0,
        y: 0,
        width: 100
    };

// ufo object
var explosion = {
        img: document.querySelector("#explosion"),
        x: 0,
        y: 66,
        width: 142
    };

// audio elements
const SOUNDS = {
    "tos-photon-torpedo-1": null,
    "explosion": null
};

var allowSound = true;
var audio = null;
var stream = "";
var fn = "";

// audio functions
function toggleSound(){
    const elem = document.querySelector("#audio");
    if (allowSound === true) {
        allowSound = false;
    } else {
        allowSound = true;
    }
}

function doneAudio(ev) {
    SOUNDS[stream].pause();
    SOUNDS[stream] = null;
    fn = "";
    torpedo.img.style.display = "none";
}

function playSound(soundObj) {
    // if audio is playing, stop it
    if (fn !== "") {
        audio.pause();
        audio = null;
        fn = "";
    }

    // if sound on, play audio
    if (allowSound) {
        audio = document.createElement("audio");
        SOUNDS[stream] = audio;
        stream = soundObj;
        fn = "../audio/" + soundObj + ".mp3";
        audio.setAttribute("src", fn);
        audio.play();

        // create event listener for when audio ends
        audio.addEventListener("ended", doneAudio);
    }
}

function startGameHandler() {
    // Hide the intro screen, show the game screen
    introScreen.style.display = "none";
    gameScreen.style.display = "block";
    rocket.img.style.display = "block";
    ufo.img.style.display = "block";
    explosion.img.style.display = "none";
}

function impact(elem1, elem2) {
    const rec1 = elem1.getBoundingClientRect();
    const rec2 = elem2.getBoundingClientRect();

    return !(
      rec1.top > rec2.bottom || rec1.right < rec2.left ||
      rec1.bottom < rec2.top || rec1.left > rec2.right
    );
}

function explode() {
    explosion.img.style.visibility = "visible";
}

function hideExplosion() {
    explosion.img.style.display = "none";
}

function checkForHit() {
    // hide torpedo, ufo
    torpedo.img.style.display = "none";
    // check for hit
    if (impact(torpedo.img, ufo.img)) {
        // move and display explosion
        explosion.img.style.left = ufo.img.style.left;
        explosion.img.style.top = ufo.img.style.top;
        explosion.img.style.display="block";

        // hide torpedo, ufo
        torpedo.img.style.display = "none";
        ufo.img.style.display = "none";

        // play explosion
        playSound("explosion");

        // hide explosion
        setTimeout(hideExplosion, 2000);  // 5 seconds
    }
}

function fireTorpedoHandler() {
    // Fire the photon torpedo!
    // CSS animation occurs whenever torpedo
    // 'left' property changes value
    torpedo.img.style.display = "block";
    torpedo.img.style.left = (rocket.x - 200) + "px";
    playSound("tos-photon-torpedo-1");

    // after torpedo finishes, check for impact
    window.setTimeout(checkForHit,500);
}

function render() {
    // position objects on the screen
    // keep on screen
    if (rocket.x < 0) { rocket.y = 0; }
    if (rocket.y < 66) { rocket.y = 66; }
    if (rocket.x > 502) { rocket.x = 502; }
    if (rocket.y > 402) { rocket.y = 402; }
    if (ufo.y < 66) { ufo.y = 66; }
    if (ufo.y > 384) { ufo.y = 384; }
    rocket.img.style.left = rocket.x + "px";
    rocket.img.style.top = rocket.y + "px";
    ufo.img.style.left = ufo.x + "px";
    ufo.img.style.top = ufo.y + "px";
    torpedo.img.style.left = (rocket.x + 10) + "px";
    torpedo.img.style.top = (rocket.y + 8) + "px";
    torpedo.img.style.visibility = "hidden";
}

function keydownHandler(event) {
    // handle user keyboard input
    if (event.keyCode === UP) {
        rocket.y -= velocity;
    }
    if (event.keyCode === LEFT) {
        rocket.x -= velocity;
    }
    if (event.keyCode === DOWN) {
        rocket.y += velocity;
    }
    if (event.keyCode === RIGHT) {
        rocket.x += velocity;
    }
    if (event.key === UFOUP) {
        ufo.y -= velocity;
    }
    if (event.key === UFODOWN) {
        ufo.y += velocity;
    }

    render();
}

//function init() {

//}

// Initialize objects on the screen
//document.addEventListener("DOMContentLoaded", init, false);
startBtn.addEventListener("click", startGameHandler, false);
fireBtn.addEventListener("click", fireTorpedoHandler, false);
audioBtn.addEventListener("click", toggleSound, false);
window.addEventListener("keydown", keydownHandler, false);

render();
