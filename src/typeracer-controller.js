'use strict';

/**
 * The object in charge of controlling and displaying the game.
 * @param {TypingDisplayer} typingDisplayer - the object in charge of generating the HTML code to display the game.
 * @param {JQuery} jQuery - the jQuery library.
 */
class TypeRacerController {
    constructor(typingDisplayer, jQuery) {
        this.typingDisplayer = typingDisplayer;

        this.newRaceButton = new View('.new-race', jQuery);
        this.gameContainerView = new View('.game-view', jQuery);

        this.textDisplay = new TypingTextDisplay(jQuery);

        this.textArea = new TypingTextArea(jQuery);
        this.textArea.onType = text => this.handleTypedChars(text);
    }

    /**
     * Given a typeRacer game, configures it and starts a new race using it.
     * @param {TypeRacer} typeRacer - the typeRacer object to be managed.
     */
    setupRace(typeRacer) {
        this.typeRacer = typeRacer;
        this.typeRacer.onGameStart = () => this.handleGameStart();
        this.typeRacer.onGameOver = () => this.handleGameOver();

        this.typingDisplayer.setTypeRacer(typeRacer);

        this.textDisplay.display(this.typeRacer.text);
    }

    /**
     * Starts the game.
     */
    startGame() {
        this.typeRacer.start();
    }

    /**
     * Method to be called when the typeRacer game starts.
     */
    handleGameStart() {
        this.gameContainerView.setOpacity(1);
        this.newRaceButton.hide();
        this.textArea.enable();

        // TODO: Start the timer.
    }

    /**
     * Method to be called when the typeRacer game ends.
     */
    handleGameOver() {
        this.textArea.disable();
        this.gameContainerView.setOpacity(0.3);
        this.newRaceButton.show();
    }

    /**
     * Given a text, set it in the game and matches it.
     * @param {String} chars - the chars typed by the user.
     */
    handleTypedChars(text) {
        if (!this.typeRacer.isRunning) {
            return;
        }

        this.typeRacer.setTypingText(text);

        if (this.typeRacer.match()) {
            this.textArea.clear();
        }

        this.textDisplay.display(this.typingDisplayer.getHtmlText());
    }
}

/**
 * The object in charge of generating the formatted html to display the typed words and chars of the game.
 */
class TypingDisplayer {

    /**
     * Given a typeRacer game, sets it to be displayed.
     * @param {TypeRacer} typeRacer - the game to be displayed.
     */
    setTypeRacer(typeRacer) {
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
 * A general view object, wrapping an html element.
 * @param {String} selector - the Selector of the element.
 * @param {JQuery} jQuery - the jQuery library used to get the elements.
 */
class View {
    constructor(selector, jQuery) {
        // If tests are running, don't call jQuery and wrap the element objects in a proxy, 
        // so it doesn't throw errors when testing.
        if (typeof process !== 'undefined') {
            if (process.env.JEST_WORKER_ID !== undefined) {
                this.element = new Proxy({}, {
                    get(target, name) {
                        return name in target ? target[name] : new Function();
                    }
                });
            }
        } else {
            this.element = jQuery(selector)
        }

        this.isHidden = false;
        this.opacity = this.element.css('opacity') || 1;
    }

    /**
     * Hides the view.
     */
    hide() {
        this.element.addClass('hidden');
        this.isHidden = true;
    }

    /**
     * Shows the view.
     */
    show() {
        this.element.removeClass('hidden');
        this.isHidden = false;
    }

    /**
     * Sets the view opactity to the passed amount.
     */
    setOpacity(amount) {
        this.element.fadeTo('fast', amount);
        this.opacity = amount;
    }
 }

/**
 * The view object displaying the text to the user.
 * @param {JQuery} jQuery - the jquery library used to manipulate the element.
 */
class TypingTextDisplay extends View {

    constructor(jQuery) {
        super('.text-to-type', jQuery);

        /**
         * The text being displayed to the user.
         */
        this.currentText = null;
    }

    /**
     * Given a text, display it to the user in the text HTML element.
     * @param {String} text - the text to be displayed.
     */
    display(text) {
        this.currentText = text;
        this.element.html(this.currentText);
    }
}

/**
 * The user text area view object.
 * @param {JQuery} jQuery - the jQuery library used to manipulate the element.
 */
class TypingTextArea extends View {

    constructor(jQuery) {
        super('.type-area', jQuery);

        /**
         * The chars in the text area element.
         */
        this.chars = '';

        /**
         * A closure to be called when the text change.
         */
        this.onType = null;
        
        this.element.keyup(_ => {
            this.chars = this.element.val();

            if (typeof this.onType === 'function') {
                this.onType(this.chars);
            }
        });
    }

    /**
     * Clears the chars typed by the user so far.
     */
    clear() {
        this.chars = '';
        this.element.val('');
    }

    /**
     * Enables the text area element.
     */
    enable() {
        this.element.prop('disabled', false);
    }

    /**
     * Disables the text area element.
     */
    disable() {
        this.element.prop('disabled', true);
    }
}

module.exports = { TypeRacerController, TypingDisplayer, View, TypingTextArea, TypingTextDisplay };
 