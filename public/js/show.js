$(function() {

    var socket = io.connect();
    socket.on('connect', function(obj) {
        console.log(obj);
        console.log("connected successfully");
    });

    socket.on('connections', function(obj) {
        console.log(obj);
        _.each(obj, function(i) {
            add(i);
        });
    });

    socket.on('join', function(obj) {
        console.log(obj);
        add(obj);
    });

    socket.on('disconnect', function(obj) {
        if (!obj) return;
        console.log(obj);
        $('div.avatars').find('#c_' + obj.id).fadeOut();
    });

    $('div.line').live('click', function() {
        $(this).parent().parent().find('div.' + $(this).attr('class').split(' ')[1]).toggleClass('highlighted');
    });

    setTimeout(function() {
        $('table').selectable({
            filter: 'div.line',
            selecting: function(event, ui) {
                $.allLines(ui.selecting).removeClass('highlighted').addClass('highlighting');
            },
            unselecting: function(event, ui) {
                $.allLines(ui.unselecting).removeClass('highlighting');
            },
            selected: function(event, ui) {
                $.allLines(ui.selected).toggleClass('highlighted');
            },
            unselected: function(event, ui) {
                //$.allLines(ui.unselected).removeClass('highlighted');
            }
        });
    }, 500);
});

function add(client) {
    $('<span/>').addClass('avatar').attr({
        id: 'c_' + client.id
    }).append(
    $('<img/>').attr({
        'src': 'http://www.gravatar.com/avatar/' + client.hash + '?s=20&d=identicon&r=PG',
        'title': 'gravatar'
    })).hide().appendTo('div.avatars').fadeIn('slow');
}

(function($){
    $.allLines = function(objects) {
        return $('div.' + $(objects).attr('class').split(' ')[1]);
    };
})(jQuery);
