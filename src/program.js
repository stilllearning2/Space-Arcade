/*global window: false */
/*global document: false */
/*jslint node: true */
"use strict";

// Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;
var UFOUP = 119;
var UFODOWN = 122;

// Velocity
var velocity = 2;

// DOM elements
var startBtn = document.querySelector("#start");
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
        y: 0,
        width: 100
    };

// torpedo object
var torpedo = {
        img: document.querySelector("#torpedo"),
        x: 0,
        y: 0,
        width: 100
    };

function startGameHandler() {
    // Hide the intro screen, show the game screen
    introScreen.style.display = "none";
    gameScreen.style.display = "block";
    rocket.img.style.display = "block";
    ufo.img.style.display = "block";
    torpedo.img.style.display = "none";
}

function fireTorpedoHandler() {
    // Fire the photon torpedo!
    // CSS animation occurs whenever torpedo
    // 'left' property changes value
    torpedo.style.visibility = "visible";
    torpedo.style.left = (rocket.x - 200) + "px";
}

function render() {
    // position objects on the screen
    rocket.img.style.left = rocket.x + "px";
    rocket.img.style.top = rocket.y + "px";
    torpedo.img.style.left = (rocket.x + 10) + "px";
    torpedo.img.style.top = (rocket.y + 8) + "px";
    torpedo.img.style.visibility = "hidden";
    if (torpedo.x < ufo.x + 100) {
        if (torpedo.y < ufo.y + 100 && torpedo.y > ufo.y) {
            // audio explosion
            torpedo.style.display = "none";
            ufo.style.display = "none";
        }
    }
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
    if (event.keyCode === UFOUP) {
        ufo.y -= velocity;
    }
    if (event.keyCode === UFODOWN) {
        ufo.y += velocity;
    }

    render();
}

// Initialize objects on the screen
startBtn.addEventListener("click", startGameHandler, false);
fireBtn.addEventListener("click", fireTorpedoHandler, false);
window.addEventListener("keydown", keydownHandler, false);

render();