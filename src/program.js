/*global window: false */
/*global document: false */
/*jslint node: true */
"use strict";

// Arrow key codes
var UP = 38,
    DOWN = 40,
    RIGHT = 39,
    LEFT = 37,
    UFOUP = "w",
    UFODOWN = "z",

// variables
    velocity = 2,
    dilithium = 100,
    torpedoCount = 10,
    moves = 0,
    rand, 
    UFOMIN = 98,
    allowSound = true,
    fn,

// DOM elements
    startBtn = document.querySelector("#start"),
    audioBtn = document.querySelector("#audio"),
    fireBtn = document.querySelector("#fire"),
    slowerBtn = document.querySelector("#slower"),
    fasterBtn = document.querySelector("#faster"),
    introScreen = document.querySelector("#introScreen"),
    gameScreen = document.querySelector("#gameScreen"),
    dilithiumLvl = document.querySelector("#dilithiumLvl"),
    torpedoLvl = document.querySelector("#torpedo-count"),
    level = document.querySelector("#level");

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
        iframe: document.querySelector("#explosionFrame"),
        x: 10,
        y: 0,
        width: 100
    };
explosion.iframe.src = "";
explosion.iframe.frameBorder = "0";
explosion.iframe.setAttribute("frameBorder", "0");

// audio elements
var SOUNDS = {
    "tos-photon-torpedo-1": null,
    "explosion": null
};

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
    const rec1 = elem1.getBoundingClientRect(),
          rec2 = elem2.getBoundingClientRect();

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
        // display explosion
        explosion.iframe.src = "https://giphy.com/embed/ahza0v6s5pSxy";
            
        // play explosion
        playSound("explosion");
            
        // hide torpedo, ufo
        torpedo.img.style.visibility = "hidden";
        ufo.img.style.visibility = "hidden";

        // hide explosion
        window.setTimeout(hideExplosion, 600);  // .6 seconds
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
        const range = (torpedo.x - 25 < 200 ? torpedo.x - 25 : 200);
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
        dilithium = Math.round(dilithium * 100) / 100.00;
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
    introScreen.style.display = "none";
    gameScreen.style.display = "block";
    rocket.img.style.display = "block";
    ufo.img.style.visibility = "visible";
    torpedo.img.style.visibility = "hidden";

    render();
}

function init() {
    // Initialize objects on the screen
    fireBtn.addEventListener("click", showTorpedoHandler, false);
    slowerBtn.addEventListener("click", levelDownHandler, false);
    fasterBtn.addEventListener("click", levelUpHandler, false);
    audioBtn.addEventListener("click", toggleSound, false);
    window.addEventListener("keydown", keydownHandler, false);
}

window.addEventListener("load", init, false);
startBtn.addEventListener("click", startGameHandler, false);
