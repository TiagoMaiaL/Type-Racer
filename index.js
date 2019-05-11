'use strict';

$('document').ready(_ => {
    // Instantiate typeracer.
    const typeRacer = new TypeRacer($('.text-to-type').text());
    const displayer = new TypingDisplayer(typeRacer);

    const controller = new TypeRacerController(typeRacer, displayer);
    controller.startGame();
});
