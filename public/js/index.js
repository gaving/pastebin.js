$(function() {
    $.getJSON('/stats', function(stats) {
        $('a.stats > span').html(stats.pastes + " pastes, " + stats.lines + " lines");
    });
});
