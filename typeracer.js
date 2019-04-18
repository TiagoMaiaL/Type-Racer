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
 * Given a player with n typed words, returns the index of the current word the user is typing.
 */
Player.prototype.getTypingIndex = function() {
    return this.typedWords.length;
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
     * The words of the game's text.
     */
    this.words = this.getTextComponents(this.text);

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

/**
 * Given a text, returns an array of its words with the following space character of each one.
 * @param {String} text - the text from which the components are gotten.
 * @returns {Array} - the words of the text.
 */
TypeRacer.prototype.getTextComponents = function(text) {
    return text.split(' ').map((word, i, array) => {
        return word + ((i < array.length - 1) ? ' ' : '');
    });
}

module.exports = { Player, TypeRacer };
