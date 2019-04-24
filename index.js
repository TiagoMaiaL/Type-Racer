'use strict';

$('document').ready(_ => {
    // Get a reference to the interactive HTML elements.
    const textElement = $('.text-to-type');
    const typeArea = $('.type-area');

    // Instantiate a new typeracer game.
    const typeRacer = new TypeRacer(textElement.text());
    const displayer = new TypingDisplayer(typeRacer);

    typeArea.keypress(_ => {
        typeRacer.setTypingText(typeArea.val());

        if (typeRacer.match()) {
            typeArea.val('');
        }

        textElement.html(displayer.getHtmlText());
    });
});
