$(function() {

    var socket = io.connect();
    socket.on('message', function(obj) {
        alert(obj.hi);
    });

    $('div.line').live('click', function() {
        $(this).parent().parent().find('div.' + $(this).attr('class').split(' ')[1]).toggleClass('highlighted');
    });

    setTimeout(function(){
        $("table").selectable({
            filter: "div.line",
            selecting: function(event, ui) {
                $('div.' + $(ui.selecting).attr('class').split(' ')[1]).removeClass('highlighted').addClass('highlighting');
            },
            unselecting: function(event, ui) {
                $('div.' + $(ui.unselecting).attr('class').split(' ')[1]).removeClass('highlighting');
            },
            selected: function(event, ui) {
                $('div.' + $(ui.selected).attr('class').split(' ')[1]).toggleClass('highlighted');
            },
            unselected: function(event, ui) {
                //$('div.' + $(ui.unselected).attr('class').split(' ')[1]).removeClass('highlighted');
            }
        })}, 1000);

});
