'use strict';

const { TypeRacerController, TypingDisplayer, TypingTextArea, TypingTextDisplay } = require('../src/typeracer-controller');
const { TypeRacer } = require('../src/typeracer');

describe('TypeRacerController', () => {
    beforeEach(() => {
        this.typeRacer = new TypeRacer('Testing');
        this.typingDisplayer = new TypingDisplayer(this.typeRacer);
        this.controller = new TypeRacerController(this.typeRacer, this.typingDisplayer);
    });

    afterEach(() => {
        this.typeRacer = null;
        this.controller = null;
    });

    test('it accepts a typeRacer object in it\'s constructor', () => {
        expect(this.controller.typeRacer).toBe(this.typeRacer);
    });

    test('it accepts a typingDisplayer object in it\'s constructor', () => {
        expect(this.controller.typingDisplayer).toBe(this.typingDisplayer);
    });

    test('it creates a view that displays the game\'s text to the user', () => {
        expect(this.controller.textDisplay).toBeInstanceOf(TypingTextDisplay);
    });

    test('it creates a view that gets the user input', () => {
        expect(this.controller.textArea).toBeInstanceOf(TypingTextArea)
    });

    test('it assigns its handleGameStart method as the callback of the typeRacer game', () => {
        expect(this.typeRacer.onGameStart).toBeInstanceOf(Function);
    });

    test('it assigns its handleGameOver method as the callback of the typeRacer game', () => {
        expect(this.typeRacer.onGameOver).toBeInstanceOf(Function);
    });

    test('it assigns its handleTypeChars method as the callback of the text area', () => {
        expect(this.controller.textArea.onType).toBeInstanceOf(Function);
    });

    test('it has a method to start the game', () => {
        this.controller.startGame();
        expect(this.typeRacer.isRunning).toBe(true);
    });

    test('it sets and matches the typed text in the game', () => {
        this.controller.typeRacer = new TypeRacer('text')
        this.controller.startGame();
        this.controller.typingDisplayer.typeRacer = this.controller.typeRacer;
        this.controller.handleTypedChars('tes');

        expect(this.controller.textDisplay.currentText).toBe(this.controller.typingDisplayer.getHtmlText());
    });
});

describe('TypingDisplayer', () => {
    test('initiates with the passed typeRacer game', () => {
        const typeRacer = new TypeRacer('Example text');
        expect((new TypingDisplayer(typeRacer)).typeRacer).toBe(typeRacer);
    });

    test('displays the typed words in a specific span', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.currentPlayer.typedWords = [
            'This ',
            'is ',
            'a ',
            'testing ',
            'text.'
        ];
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typed-words">This is a testing text.</span>'

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('displays the typed words and the words still to be typed', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.currentPlayer.typedWords = [
            'This ',
            'is '
        ];
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typed-words">This is </span>a testing text.';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('displays the text that\'s being typed, and that matches the word so far', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.setTypingText('Thi');
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typing-text matched">Thi</span>s is a testing text.';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('displays the length of the mistyped chars with a span in the text', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.setTypingText('asdf');
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typing-text non-matched">This</span> is a testing text.';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('display the chars that match the current word, and the ones that doesn\'t', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.setTypingText('Th----------');
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typing-text matched">Th</span><span class="typing-text non-matched">is is a te</span>sting text.';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('display the typed chars, the chars that match the current word, and the ones that doesn\'t', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.currentPlayer.typedWords = [
            'This ',
            'is '
        ];
        typeRacer.setTypingText('a------');
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typed-words">This is </span><span class="typing-text matched">a</span><span class="typing-text non-matched"> testi</span>ng text.';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('display the unmatched chars as far as the length of the remaining text', () => {
        const typeRacer = new TypeRacer('testing.');
        typeRacer.setTypingText('-'.repeat(100));

        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typing-text non-matched">testing.</span>';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('display the typed words and the unmatched chars until the last char of the text', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.currentPlayer.typedWords = [
            'This ',
            'is '
        ];
        typeRacer.setTypingText('-'.repeat(100));

        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typed-words">This is </span><span class="typing-text non-matched">a testing text.</span>';

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });
});

describe('TypingTextDisplay', () => {
    test('it starts with its current text set to null', () => {
        const textDisplay = new TypingTextDisplay();
        expect(textDisplay.currentText).toBeDefined();
    });

    test('it has a method for setting the text it\'s displaying', () => {
        const textDisplay = new TypingTextDisplay();
        textDisplay.display('testing');
        expect(textDisplay.currentText).toBe('testing');
    });
});

describe('TypingTextArea', () => {
    test('it starts with its typedText empty', () => {
        const textArea = new TypingTextArea();
        expect(textArea.chars).toBe('');
    });

    test('it has a method to clear it\'s content', () => {
        const textArea = new TypingTextArea();
        textArea.chars = 'testing';
        textArea.clear();

        expect(textArea.chars).toBe('');
    });

    test('it has a callback property to be called when the text changes', () => {
        const textArea = new TypingTextArea();
        expect(textArea.onType).toBeNull();
    });
});
