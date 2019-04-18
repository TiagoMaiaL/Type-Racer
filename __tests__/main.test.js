'use strict';

const { Player, TypeRacer } = require('../typeracer');

describe('Player methods', () => {
    test('returns the current typing index of the player', () => {
        const player = new Player();
        player.typedWords = ['typed ', 'words ', 'to ', 'test '];

        expect(player.getTypingIndex()).toEqual(4);
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
