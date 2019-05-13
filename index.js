'use strict';

$('document').ready(_ => {
    const textToType = 'Testing game.';

    // Instantiate typeracer.
    const typeRacer = new TypeRacer(textToType);
    const displayer = new TypingDisplayer(typeRacer);

    const controller = new TypeRacerController(typeRacer, displayer, $);
    controller.startGame();
});
