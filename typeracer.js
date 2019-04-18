'use strict';

/**
 * The TypeRacer player object type.
 */
function Player() {
    /**
     * The words typed by the player so far.
     */
    this.typedWords = [];
}

/**
 * The TypeRacer game object type.
 * @param {String} text - the text to be typed by the players.
 */
function TypeRacer(text) {
    if (typeof text !== 'string' || text.length === 0) {
        throw new TypeError('The text must be valid.');
    }

    /**
     * The internal reference to the text to be typed by the players.
     */
    this.text = text;

    /**
     * The current player client.
     */
    this.currentPlayer = new Player();

    /**
     * The players of the game.
     */
    this.players = [this.currentPlayer];

    /**
     * The initial date time of the game.
     */
    this.startTime = Date.now();

    /**
     * The seconds past its initial time.
     */
    this.currentSeconds = 0;

    /**
     * The time to end the game.
     */
    this.endTime = this.startTime + 60;
}

module.exports = { Player, TypeRacer };
