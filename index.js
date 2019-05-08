'use strict';

$('document').ready(_ => {
    // Get a reference to the interactive HTML elements.
    const textElement = $('.text-to-type');
    const typeArea = $('.type-area');

    // Instantiate a new typeracer game.
    const typeRacer = new TypeRacer(textElement.text());
    const displayer = new TypingDisplayer(typeRacer);

    typeRacer.start();

    // Listen to the keyup event and feed the game with the typing data.
    typeArea.keyup(_ => {
        // If the game isn't running, the text area should be disabled.
        if (!typeRacer.isRunning) return;

        typeRacer.setTypingText(typeArea.val());

        if (typeRacer.match()) {
            typeArea.val('');
        }

        textElement.html(displayer.getHtmlText());
    });
});
