'use strict';

const { Player, TypeRacer } = require('../typeracer');

describe('Player constructor', () => {
    test('initiates with no typed words', () => {
        expect((new Player()).typedWords).toEqual([]);
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
