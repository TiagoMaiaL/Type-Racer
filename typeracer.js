'use strict';

/**
 * The TypeRacer player object type.
 */
function Player() {
    /**
     * The words typed by the player so far.
     */
    this.typedWords = [];

    /**
     * The text currently being typed by the player.
     */
    this.typingText = '';
}

/**
 * Given a player with n typed words, returns the index of the current word the user is typing.
 */
Player.prototype.getTypingIndex = function() {
    return this.typedWords.length;
}

/**
 * Given a word, returns true if the current text typed by the word is equals to it.
 * @param {String} word - the word to be compared.
 * @returns {Boolen} - true if the text is equals to the word, false otherwise.
 */
Player.prototype.currentTextMatches = function(word) {
    return this.typingText === word;
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

/**
 * Given a text being typed, sets the typing text of the current player with it.
 * @param {String} text - the text being typed by the player.
 */
TypeRacer.prototype.setTypingText = function(text) {
    if (typeof text !== 'string') {
        throw new TypeError('The provided string must be a valid one.');
    }

    this.currentPlayer.typingText = text;
}

/**
 * Given a text being typed, matches it against the current text word and updates the player text attributes.
 * @param {String} text - the text being typed by the player.
 * @param {Boolean} - the boolean indicating if the text matched the word.
 */
TypeRacer.prototype.match = function(text) {

}

module.exports = { Player, TypeRacer };
