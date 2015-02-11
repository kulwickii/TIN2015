$('.resiz').resizable({
    aspectRatio: true
});
$('.dragg').draggable();

$('.resiz').click(function() {
    var id = $(this).attr('id');
    var div2 = '#' + (id);
    id++;
    var pos = $(div2).offset();
    var height = $(div2).height();
    var width = $(div2).width();
    
    $('#save').css({'display': 'flex'});
    setTimeout(function() {
          $('#save').css({'display': 'none'});
    }, 2000);
    
    var obj = {
        "id": id,
        "pos_x": pos.left-20,
        "pos_y": pos.top-20,
        "height": height,
        "width": width
    };
    socket.emit('position', obj);
});

$('.del').click(function() {
    $('.del').css({'display': 'none'});
    var id = $(this).attr('id');
    socket.emit('delete item', id);
});