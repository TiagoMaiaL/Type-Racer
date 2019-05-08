'use strict';

const { Player, TypeRacer, SecondsChecker, TypingDisplayer } = require('../typeracer');

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

    test('getMatchedTypingChars returns empty texts if the player hasn\'t typed anything', () => {        
        expect((new TypeRacer('testing text.')).getMatchedTypingChars()).toEqual(['', '']);
    });

    test('getMatchedTypingChars returns the typed chars that match with the current word to be typed', () => {
        const typeRacer = new TypeRacer('testing text.');
        typeRacer.setTypingText('tes');

        expect(typeRacer.getMatchedTypingChars()).toEqual(['tes', '']);
    });

    test('getMatchedTypingChars returns the typed chars that don\'t match with the current word to be typed', () => {
        const typeRacer = new TypeRacer('testing text.');
        typeRacer.setTypingText('asdf');

        expect(typeRacer.getMatchedTypingChars()).toEqual(['', 'asdf']);
    });

    test('starts the game by setting its isRunning flag to true', () => {
        const typeRacer = new TypeRacer('test');
        typeRacer.start();

        expect(typeRacer.isRunning).toBe(true);
    });

    test('starting the game should initialize its secondsChecker', () => {
        const typeRacer = new TypeRacer('test');
        typeRacer.start();

        expect(typeRacer.secondsChecker).toBeInstanceOf(SecondsChecker);
    });

    test('setting the game seconds within the limit', () => {
        const typeRacer = new TypeRacer('test');
        typeRacer.start();
        typeRacer.setTime(12);

        expect(typeRacer.isRunning).toBe(true);
        expect(typeRacer.isOver).toBe(false);
    });

    test('setting the game seconds off the race limit should end the game', () => {
        const typeRacer = new TypeRacer('test');
        typeRacer.start();
        typeRacer.setTime(82); // More than the race time.

        expect(typeRacer.isRunning).toBe(false);
        expect(typeRacer.isOver).toBe(true);
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

    test('initiates with the game not yet started', () => {
        expect((new TypeRacer('test')).isRunning).toBe(false);
    });

    test('initiates with the game not over', () => {
        expect((new TypeRacer('test')).isOver).toBe(false);
    });

    test('initiates with its seconds checker set to null', () => {
        expect((new TypeRacer('test')).secondsChecker).toBeNull();
    })
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

describe('SecondsChecker', () => {
    test('it accepts the start time property in its constructor', () => {
        const startTime = Date.now();
        const checker = new SecondsChecker(startTime, Date.now());

        expect(checker.startTime).toBe(startTime);
    });

    test('it accepts the end time property in its constructor', () => {
        const endTime = Date.now() + 60;
        const checker = new SecondsChecker(Date.now(), endTime);

        expect(checker.endTime).toBe(endTime);
    });

    test('it rejects an invalid start time', () => {
        expect(() => new SecondsChecker(null, Date.now())).toThrow(TypeError);
    });

    test('it rejects an invalid end time', () => {
        expect(() => new SecondsChecker(Date.now(), null)).toThrow(TypeError);
    });

    test('it returns false if the seconds didn\'t pass endTime', () => {
        const checker = new SecondsChecker(Date.now(), Date.now() + 60);
        expect(checker.passesEndTime(35)).toBe(false);
    });

    test('it returns true if the seconds pass endTime', () => {
        const checker = new SecondsChecker(Date.now(), Date.now() + 60);
        expect(checker.passesEndTime(61)).toBe(true);
    });

    test('it refuses to check for invalid seconds', () => {
        const checker = new SecondsChecker(Date.now(), Date.now() + 60);
        expect(() => checker.passesEndTime()).toThrow(TypeError);
        expect(() => checker.passesEndTime(null)).toThrow(TypeError);
    });

    test('it refuses to check invalid numbers', () => {
        const checker = new SecondsChecker(Date.now(), Date.now() + 20);
        expect(() => checker.passesEndTime(-12)).toThrow(RangeError);
        expect(() => checker.passesEndTime(0)).toThrow(RangeError);
    });
});
