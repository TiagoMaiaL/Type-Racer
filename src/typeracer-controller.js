'use strict';

/**
 * The object in charge of controlling and displaying the game.
 * @param {TypeRacer} typeRacer - the typeRacer object to be managed.
 * @param {TypingDisplayer} typingDisplayer - the object in charge of generating the
 *                                            HTML code to display the game.
 */
class TypeRacerController {
    constructor(typeRacer, typingDisplayer) {
        this.typeRacer = typeRacer;
        this.typingDisplayer = typingDisplayer;  

        this.textDisplay = new TypingTextDisplay();
        this.textArea = new TypingTextArea();
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

/**
 * The view object displaying the text to the user.
 */
class TypingTextDisplay {

}

/**
 * The user text area view object.
 */
class TypingTextArea {

}

module.exports = { TypeRacerController, TypingDisplayer, TypingTextArea, TypingTextDisplay };
 