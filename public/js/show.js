$(function() {

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
                $.allLines(ui.selected).toggleClass('highlighted').toggleMark(true);
                //Lines.transmit();
            },
            unselected: function(event, ui) {
                $.allLines(ui.unselected).removeClass('highlighted').toggleMark(false);
            }
        });

        $.handleLineAnchor();
    }, 500);
});

Lines = function () {
    return {
        me: {},

        transmit: function () {
            var socket = Show.getSocket();
            if (!socket) return;
            /* transmit highlighted lines */
        }
    };
}();

Show = function () {
    var Avatar = {
        me: {},

        init: function () {
            var avatar = this;
            var socket = io.connect();
            this.socket = socket;
            socket.on('connect', function(obj) {
                console.log("connected successfully");
            });

            socket.on('me', function(obj) {
                avatar.me = obj;
                avatar.add(obj, true);
            });

            socket.on('connections', function(obj) {
                _.each(obj, function(i) {
                    avatar.add(i);
                });
            });

            socket.on('join', function(obj) {
                avatar.add(obj);
            });

            socket.on('disconnect', function(obj) {
                if (!obj) return;
                $('div.avatars').find('#c_' + obj.id).fadeOut();
            });
        },

        add: function (client, me) {
            $('<span/>').addClass('avatar').attr({
                id: 'c_' + client.id
            }).append(
                $('<img/>').attr({
                    'src': 'http://www.gravatar.com/avatar/' + client.hash + '?s=20&d=identicon&r=PG',
                    'title': 'gravatar'
                })
            ).hide().toggleClass("me", me || false).prependTo('div.avatars').fadeIn('slow');
        },

        getSocket: function() {
            return this.socket;
        },

        getClient: function() {
            return this.me;
        }
    };
    return Avatar;
}();

Show.init();


(function($){
    $.allLines = function(objects) {
        return $('div.' + $(objects).attr('class').split(' ')[1]);
    };

    $.handleLineAnchor = function() {
        var b = window.location.hash, c;
        if (c = b.match(/#?(?:L|-)(\d+)/g)) {
            c = $.map(c, function (a) {
                return parseInt(a.replace(/\D/g, ""), 10);
            });
            c[1] = c.length === 1 ? c[0] : c[1];
            for (var d = c[0]; d <= c[1]; d++) {
                $("div.number" + d).addClass("highlighted");
            }
            $('#content').animate({
                scrollTop: $("div.number" + c[0]).offset().top-100
            }, {
                duration: 'slow',
                easing: 'swing'
            });
        }
    };

    $.fn.toggleMark = function(mark) {
        this.first().find('img').remove();
        if (mark) {
            this.first().prepend(
                $('<img/>').attr({
                    'src': 'http://www.gravatar.com/avatar/' + Show.getClient().hash + '?s=10&d=identicon&r=PG',
                    'title': 'gravatar'
                })
            );
        }
        return this;
    };
})(jQuery);
