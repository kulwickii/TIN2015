$('#button2').click(function() {
    $('#siofu_input').click();
});

$('#button1').click(function() {
    $('#adn').css({'display': 'flex'});
});

$('#button3').click(function() {
    $('.del').css({'display': 'block'});
    //socket.emit('delete to server', '');
});

$('#button:nth-child(1)').click(function() {
    $('#adn').css({'display': 'none'});
    var adn = $('textarea#adn_textarea').val();
    socket.emit('adnotacja', adn);
});

$('#button:nth-child(2)').click(function() {
    $('#adn').css({'display': 'none'});
});