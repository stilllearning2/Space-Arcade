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
    "zapsplat-explosion": null
};

var allowSound = true;
var fn;

// audio functions
function toggleSound() {
    if (allowSound === true) {
        allowSound = false;
    } else {
        allowSound = true;
    }
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
    if (SOUNDS[fn]) {
        SOUNDS[fn].pause();
        SOUNDS[fn] = null;
    }

    // create audio element and set src
    var audio = document.createElement("audio");
    audio.src = src;
    
    // volume setting
    if (fn === "zapsplat-explosion") {
        audio.volumne = 1.0;
    } else {
        audio.volumne = 0.5;
    }

    if (allowSound) {
        // set SOUNDS element = audio and play
        SOUNDS[fn] = audio;
        audio.setAttribute("data-file", fn);
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
    var rec1 = elem1.getBoundingClientRect();
    var rec2 = elem2.getBoundingClientRect();

    return !(
        rec1.top > rec2.bottom || rec1.right < rec2.left ||
        rec1.bottom < rec2.top || rec1.left > rec2.right
    );
}

function hideExplosion() {
    explosion.iframe.src = "";
}

function checkForHit() {
    // check for hit
    if (impact(torpedo.img, ufo.img)) {
        // play explosion
        playSound("zapsplat-explosion");
        
        // display explosion
        explosion.iframe.src = "https://giphy.com/embed/ahza0v6s5pSxy";

        // hide torpedo, ufo
        torpedo.img.style.visibility = "hidden";
        ufo.img.style.visibility = "hidden";

        // play explosion
        playSound("zapsplat-explosion");

        // hide explosion
        window.setTimeout(hideExplosion, 500);  // 5 seconds
    }
}

function hideTorpedo() {
    torpedo.img.style.visibility = "hidden";
    render();
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
        torpedo.img.style.left = (rocket.x - 200) + "px";

        // update avaiable torpedos
        torpedoCount = torpedoCount - 1;
        gameInfo.innerHTML = "PHOTON TORPEDOES: " + torpedoCount;

        // after torpedo finishes, check for impact
        window.setTimeout(checkForHit, 800);
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
    explosion.y = ufo.y - 20;
    // position objects on the screen
    rocket.img.style.left = rocket.x + "px";
    rocket.img.style.top = rocket.y + "px";
    ufo.img.style.top = ufo.y + "px";
    explosion.iframe.style.top = explosion.y + "px";
    torpedo.img.style.left = (rocket.x - 10) + "px";
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

function init() {
    startBtn.addEventListener("click", startGameHandler, false);
    fireBtn.addEventListener("click", showTorpedoHandler, false);
    audioBtn.addEventListener("click", toggleSound, false);
    window.addEventListener("keydown", keydownHandler, false);

    render();
}

// Initialize objects on the screen
document.addEventListener("DOMContentLoaded", init, false);
