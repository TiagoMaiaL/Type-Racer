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
Player.prototype.textMatches = function(word) {
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
 * Having a text being typed, returns the portion of it that matches the current word, and the portion of it that doesn't.
 * @returns {Array|Null} typingTexts - null if there's no typing text, or the array containing the portions of the text, 
 *                                     with the index 0 containing the matched text, and 1 the non-matched one.
 */
TypeRacer.prototype.getMatchedTypingChars = function() {
    const typingText = this.currentPlayer.typingText;
    const currentWord = this.words[this.currentPlayer.getTypingIndex()];

    let matchedChars = '';
    let unmatchedChars = '';
    
    for (let i = 0; i < typingText.length; i++) {
        const typedChar = typingText[i];
        const wordChar = currentWord[i];

        if (typedChar === wordChar) {
            matchedChars += typedChar;
        } else {
            unmatchedChars = typingText.slice(i);
            break;
        }
    }

    return [matchedChars, unmatchedChars];
}


/**
 * Given a text being typed, matches it against the current text word and updates the player text attributes.
 * @param {Boolean} - the boolean indicating if the text matched the word.
 */
TypeRacer.prototype.match = function() {
    const word = this.words[this.currentPlayer.getTypingIndex()];
    const matches = this.currentPlayer.textMatches(word)

    if (matches) {
        this.currentPlayer.typingText = '';
        this.currentPlayer.typedWords.push(word);
    }

    return matches;
}

/**
 * The object in charge of generating the formatted html to display the game.
 */
function TypingDisplayer(typeRacer) {
    /**
     * The TypeRacer game containing the data to be displayed.
     */
    this.typeRacer = typeRacer;
}

/**
 * Generates the html text to display the current state of the TypeRacer game based on the words typed by the user, 
 * the current chars being typed, and the text still to be typed.
 * @returns {String} the html text.
 */
TypingDisplayer.prototype.getHtmlText = function() {
    let typedHtmlText = '';
    if (this.typeRacer.currentPlayer.typedWords.length > 0) {
        typedHtmlText = `<span class="typed-words">${ this.typeRacer.currentPlayer.typedWords.join('') }</span>`;
    }

    const typingIndex = this.typeRacer.currentPlayer.getTypingIndex();
    const [matchedChars, unmatchedChars] = this.typeRacer.getMatchedTypingChars();
    let toTypeHtmlText = this.typeRacer.words.slice(typingIndex).join('');
    
    if (matchedChars.length > 0) {
        toTypeHtmlText = `<span class="typing-text matched">${ toTypeHtmlText.slice(0, matchedChars.length) }</span>${ toTypeHtmlText.slice(matchedChars.length) }`;
    }

    if (unmatchedChars.length > 0) {
        toTypeHtmlText = `<span class="typing-text non-matched">${ toTypeHtmlText.slice(matchedChars.length, unmatchedChars.length) }</span>${ toTypeHtmlText.slice(unmatchedChars.length) }`;
    }

    return `${ typedHtmlText }${ toTypeHtmlText }`;
}

module.exports = { Player, TypeRacer, TypingDisplayer };
