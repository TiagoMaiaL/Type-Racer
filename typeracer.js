'use strict';

/**
 * The TypeRacer player object type.
 */
class Player {

    constructor() {
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
    getTypingIndex() {
        return this.typedWords.length;
    }

    /**
     * Given a word, returns true if the current text typed by the user is equals to it.
     * @param {String} word - the word to be compared.
     * @returns {Boolen} - true if the text is equals to the word, false otherwise.
     */
    textMatches(word) {
        return this.typingText === word;
    }
}

/**
 * The TypeRacer game object type.
 */
class TypeRacer {
    /**
     * @param {String} text - the text to be typed by the players.
     */
    constructor(text) {
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
         * Flag indicating if the game is started or not.
         */
        this.isRunning = false;

        /**
         * A closure reference called to inform the game has just started.
         */
        this.onGameStart = null;

        /**
         * Flag indicating if hte is over.
         */
        this.isOver = false;

        /**
         * A closure reference called when the game has just ended.
         */
        this.onGameOver = null;

        /**
         * The object in charge of checking if the race time is over.
         */
        this.secondsChecker = null;
    }

    /**
     * Starts the game and starts counting down the race time.
     */
    start() {
        this.isRunning = true;
        this.secondsChecker = new SecondsChecker(Date.now(), Date.now() + 60);

        if (typeof this.onGameStart === 'function') {
            this.onGameStart();
        }
    }

    /**
     * Ends the game, by calling its end closure reference, if there's one.
     */
    end() {
        this.isOver = true;
        this.isRunning = false;

        if (typeof this.onGameOver === 'function') {
            this.onGameOver();
        }
    }

    /**
     * Given an amount of seconds, set this amount as the time since the game started, 
     * ending the game if seconds pass the limit.
     * @param {Number} seconds - the amount of seconds since the game began.
     */
    setTime(seconds) {
        if (this.secondsChecker.passesEndTime(seconds)) {
            this.end();
        }
    }

    /**
     * Given a text, returns an array of its words with the following space character of each one.
     * @param {String} text - the text from which the components are gotten.
     * @returns {Array} - the words of the text.
     */
    getTextComponents(text) {
        return text.split(' ').map((word, i, array) => {
            return word + ((i < array.length - 1) ? ' ' : '');
        });
    }

    /**
     * Given a text being typed, sets the typing text of the current player with it.
     * @param {String} text - the text being typed by the player.
     */
    setTypingText(text) {
        if (typeof text !== 'string') {
            throw new TypeError('The provided string must be a valid one.');
        }

        this.currentPlayer.typingText = text;
    }

    /**
     * Gets the text containing words that still need to be typed by the player, including the current one.
     * @returns {String} the text to be typed.
     */
    getRemainingText() {
        return this.words.slice(this.currentPlayer.getTypingIndex()).join('');
    }

    /**
     * Having a text being typed, returns the portion of it that matches the current word, and the portion of it that doesn't.
     * @returns {Array|Null} typingTexts - null if there's no typing text, or the array containing the portions of the text, 
     *                                     with the index 0 containing the matched text, and 1 the non-matched one.
     */
    getMatchedTypingChars() {
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
    match() {
        const word = this.words[this.currentPlayer.getTypingIndex()];
        const matches = this.currentPlayer.textMatches(word)

        if (matches) {
            this.currentPlayer.typingText = '';
            this.currentPlayer.typedWords.push(word);

            if (this.getRemainingText().length === 0) {
                this.end();
            }
        }

        return matches;
    }
}

/**
 * An object that checks if the provided seconds passed the time limit.
 */
class SecondsChecker {
    /**
     * @param {Number} startTime - the time interval of the start date.
     * @param {Number} endTime - the time interval of the end date.
     */
    constructor(startTime, endTime) {
        for (let i = 0; i < arguments.length; i++) {
            const argument = arguments[i];

            if (typeof argument !== 'number' || isNaN(argument)) {
                throw new TypeError('The passed date must be a valid time interval');
            }
        }
        
        /**
         * The initial time used to check seconds.
         */
        this.startTime = startTime;
    
        /**
         * The end time used to check if the seconds passed it.
         */
        this.endTime = endTime;
    }

    /**
     * Given a number of seconds
     * @param {Number} seconds - the amount of seconds.
     */
    passesEndTime(seconds) {
        if (typeof seconds != 'number' || isNaN(seconds)) {
            throw new TypeError('The seconds must be of the number type.');
        }

        if (seconds <= 0) {
            throw new RangeError('The seconds must be positive and greater than 0');
        }

        return this.endTime - this.startTime < seconds;
    }
}

/**
 * The object in charge of generating the formatted html to display the game.
 */
class TypingDisplayer {

    constructor(typeRacer) {
        /**
         * The TypeRacer game containing the data to be displayed.
         */
        this.typeRacer = typeRacer;
    }

    /**
     * Generates the html text to display the words already typed by the player.
     * @returns {String} the text displaying the words typed.
     */
    getTypedWordsHtmlText() {
        return this.typeRacer.currentPlayer.typedWords.length > 0 ? 
            `<span class="typed-words">${ this.typeRacer.currentPlayer.typedWords.join('') }</span>` : 
            '';
    }

    /**
     * Generates the html text to display the chars currently being typed by the player. 
     * The html highlights the chars matching the current word, and the length of the ones that don't.
     * @returns {String} the text displaying the chars being typed.
     */
    getTypingCharsHtmlText() {
        const [matchedChars, unmatchedChars] = this.typeRacer.getMatchedTypingChars();

        let matchedCharsText = '';
        if (matchedChars.length > 0) {
            matchedCharsText = `<span class="typing-text matched">${ matchedChars }</span>`;
        }

        let toTypeHtmlText = this.typeRacer.getRemainingText();
        let unmatchedCharsText = toTypeHtmlText.slice(matchedChars.length, (matchedChars.length + unmatchedChars.length)) || '';
        if (unmatchedChars.length > 0) {
            unmatchedCharsText = `<span class="typing-text non-matched">${ unmatchedCharsText }</span>`;
        }

        return `${ matchedCharsText }${ unmatchedCharsText }`;
    }

    /**
     * Generates the html text to display the rest of the text that still needs to be typed by the user.
     * @returns {String} the text displaying the text to be typed.
     */
    getToTypeHtmlText() {    
        // Get the text with the words not yet typed and remove the text being typed (both the matched chars and the ones that don't match).
        return this.typeRacer.getRemainingText().slice(this.typeRacer.currentPlayer.typingText.length);
    }

    /**
     * Generates the html text to display the current state of the TypeRacer game based on the words typed by the user, 
     * the current chars being typed, and the text still to be typed.
     * @returns {String} the html text.
     */
    getHtmlText() {
        // Get the typed words around a specific scope.
        const typedWordsText = this.getTypedWordsHtmlText();

        // Get the text currently being typed by the user, with a span for the chars matching the current word,
        // and a span for displaying the length of the mistype.
        const typingCharsText = this.getTypingCharsHtmlText();

        // Get the final part of the text: the words still to be typed.
        const toTypeText = this.getToTypeHtmlText();

        // Return a concatanation of each part.
        return `${ typedWordsText }${ typingCharsText }${ toTypeText }`;
    }
}

module.exports = { Player, TypeRacer, SecondsChecker, TypingDisplayer };
