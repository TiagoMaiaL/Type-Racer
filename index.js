'use strict';

$('document').ready(_ => {
    const textToType = 'Testing game.';

    let controller = null;

    const makeGame = text => {
        // Instantiate typeracer.
        const typeRacer = new TypeRacer(text);

        const displayer = new TypingDisplayer();
        displayer.setTypeRacer(typeRacer);

        controller = new TypeRacerController(displayer, $);
        controller.setupRace(typeRacer);
        controller.startGame();
    }
    makeGame(textToType);
    
    // TODO: Decide if the new game feature should be moved into the controller.
    $('.new-race').click(() => {
        makeGame(textToType);
    });
});
