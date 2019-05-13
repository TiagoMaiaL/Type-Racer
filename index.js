'use strict';

$('document').ready(_ => {
    const textToType = 'Testing game.';
    let gamesCount = 1;

    // Instantiate typeracer.
    const typeRacer = new TypeRacer(textToType);

    const displayer = new TypingDisplayer();
    displayer.setTypeRacer(typeRacer);

    let controller = new TypeRacerController(displayer, $);
    controller.setupRace(typeRacer);
    controller.startGame();

    $('.new-race').click(() => {
        controller.setupRace(new TypeRacer(`${textToType} ${gamesCount++}`));
        controller.startGame();
    });
});
