'use strict';

const { Player, TypeRacer, TypingDisplayer } = require('../typeracer');

describe('Player methods', () => {
    test('returns the current typing index of the player', () => {
        const player = new Player();
        player.typedWords = ['typed ', 'words ', 'to ', 'test '];

        expect(player.getTypingIndex()).toEqual(4);
    });

    test('does not match the current text with the passed word', () => {
        const player = new Player();
        player.typingText = 'asdffds';

        expect(player.textMatches('word ')).toEqual(false);
    });

    test('matches the current text with the passed word', () => {
        const player = new Player();
        player.typingText = 'word ';

        expect(player.textMatches('word ')).toEqual(true);
    });
});

describe('Player constructor', () => {
    test('initiates with no typed words', () => {
        expect((new Player()).typedWords).toEqual([]);
    });

    test('initiate with no typing text', () => {
        expect((new Player()).typingText).toEqual('');
    });
});

describe('TypeRacer Methods', () => {
    test('returns the array of words from the passed text', () => {
        const text = 'A man who doesn\'t spend time with his family can never be a real man.';
        const expectedOutput = [
            'A ',
            'man ',
            'who ',
            'doesn\'t ',
            'spend ',
            'time ',
            'with ',
            'his ',
            'family ',
            'can ',
            'never ',
            'be ',
            'a ',
            'real ',
            'man.'
        ];

        expect(TypeRacer.prototype.getTextComponents(text)).toEqual(expectedOutput);
    });

    test('throws an error if the text being setted to the player isn\'t a string', () => {
        const typeRacer = new TypeRacer('Some text');
        expect(() => typeRacer.setTypingText(null)).toThrow(TypeError);
    });

    test('sets the current player\'s text', () => {
        const expectedOutput = 'Test';
        const typeRacer = new TypeRacer('This is a test text.');
        typeRacer.setTypingText(expectedOutput);

        expect(typeRacer.currentPlayer.typingText).toEqual(expectedOutput);
    });

    test('match returns false if the passed text does not match the current word', () => {
        const typeRacer = new TypeRacer('This is a test text.');
        typeRacer.setTypingText('asdf');

        expect(typeRacer.match()).toEqual(false);
    });

    test('match returns true if the passed text matches the current word', () => {
        const typeRacer = new TypeRacer('This is a test text.');
        typeRacer.setTypingText('This ');
        
        expect(typeRacer.match()).toEqual(true);
    });

    test('match clears the player typing text if it matches the current word', () => {
        const typeRacer = new TypeRacer('This is a test text.');
        typeRacer.setTypingText('This ');
        typeRacer.match();
        
        expect(typeRacer.currentPlayer.typingText).toEqual('');
    });

    test('match adds the current text to the player\'s typed ones if there\'s a match', () => {
        const typeRacer = new TypeRacer('This is a test text.');
        typeRacer.setTypingText('This ');
        typeRacer.match();
        
        expect(typeRacer.currentPlayer.typedWords.pop()).toEqual('This ');
    });
});

describe('TypeRacer constructor', () => {
    test('throws an error if the passed text is not a string', () => {
        expect(() => new TypeRacer()).toThrow(TypeError);
    });

    test('throws an error if the passed text is empty', () => {
        expect(() => new TypeRacer('')).toThrow(TypeError);
    });

    test('initiates with the passed text', () => {
        const textInput = 'Great men are not born great, they grow great...';
        expect(new TypeRacer(textInput).text).toEqual(textInput);
    });

    test('initiates with a property holding the words of the text', () => {
        const typeRacer = new TypeRacer('Never hate your enemies. It affects your judgment.');
        const expectedProperty = [
            'Never ',
            'hate ',
            'your ',
            'enemies. ',
            'It ',
            'affects ',
            'your ',
            'judgment.'
        ];

        expect(typeRacer.words).toEqual(expectedProperty);
    });

    test('initiates with a current player', () => {
        expect((new TypeRacer('testing')).currentPlayer).toEqual(new Player());
    });

    test('initiates with the players', () => {
        const typeRacer = new TypeRacer('test');
        expect(typeRacer.players).toEqual([typeRacer.currentPlayer]);
    });

    test('initiates with the starting time set to something', () => {
        expect((new TypeRacer('test')).startTime).toEqual(expect.anything());
    });

    test('initiates with the current time set to 0', () => {
        expect((new TypeRacer('test')).currentSeconds).toEqual(0);
    });

    test('initiates with the end time set to the start time + 1 minute', () => {
        const typeRacer = new TypeRacer('test');
        const expectedEndDate = typeRacer.startTime + 60;

        expect((new TypeRacer('test')).endTime).toEqual(expectedEndDate);
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
        const expectedOutput = '<span class="typed-words">This is </span>a testing text.'

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });

    test('displays the text that\'s being typed, and that matches the word so far', () => {
        const typeRacer = new TypeRacer('This is a testing text.');
        typeRacer.setTypingText('Thi');
        const displayer = new TypingDisplayer(typeRacer);
        const expectedOutput = '<span class="typing-text matched">Thi</span>s is a testing text.'

        expect(displayer.getHtmlText()).toEqual(expectedOutput);
    });
});
