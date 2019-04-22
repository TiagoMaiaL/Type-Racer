'use strict';

$('document').ready(_ => {
    // Get a reference to the interactive HTML elements.
    const textElement = $('.text-to-type');
    const typeArea = $('.type-area');

    // Instantiate a new typeracer game.
    const typeRacer = new TypeRacer(textElement.text());
    console.log(typeRacer);

    typeArea.keypress(_ => {
        console.log('firing');

        typeRacer.setTypingText(typeArea.val());

        if (typeRacer.match()) {
            typeArea.val('');
        }

        // TODO: Display the matches and typed text.
        
    });
});
