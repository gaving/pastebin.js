$(function() {
    _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

    SyntaxHighlighter.autoloader(
        'js jscript javascript  /js/sh/scripts/shBrushJScript.js',
        'applescript            /js/sh/scripts/shBrushAppleScript.js',
        'bash                   /js/sh/scripts/shBrushBash.js',
        'css                    /js/sh/scripts/shBrushCss.js',
        'text plain             /js/sh/scripts/shBrushPlain.js',
        'java                   /js/sh/scripts/shBrushJava.js',
        'php                    /js/sh/scripts/shBrushPhp.js',
        'py python              /js/sh/scripts/shBrushPython.js',
        'ruby                   /js/sh/scripts/shBrushRuby.js',
        'sql                    /js/sh/scripts/shBrushSql.js',
        'xml                    /js/sh/scripts/shBrushXml.js'
    );

    SyntaxHighlighter.all();

    $.getJSON('/stats', function(stats) {
        //console.log(stats);
        //var statLine = _.template("{{ pastes }} pastes {{ lines }} lines", stats);
        $('a.stats > span').html(stats.pastes + " pastes, " + stats.lines + " lines");
        $('section').show();
    });
});
