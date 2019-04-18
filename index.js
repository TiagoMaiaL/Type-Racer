'use strict';

$('document').ready(_ => {
    const currentQuote = $('.text-to-type').text();
    console.log(currentQuote);

    $('.type-area').keydown(e => {
        const userText = currentQuote;
        console.log(userText);
    });
});
