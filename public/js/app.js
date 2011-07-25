$(function() {
    _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

    SyntaxHighlighter.autoloader(
        'applescript            /js/sh/scripts/shBrushAppleScript.js',
        'actionscript3 as3      /js/sh/scripts/shBrushAS3.js',
        'bash shell             /js/sh/scripts/shBrushBash.js',
        'coldfusion cf          /js/sh/scripts/shBrushColdFusion.js',
        'cpp c                  /js/sh/scripts/shBrushCpp.js',
        'c# c-sharp csharp      /js/sh/scripts/shBrushCSharp.js',
        'css                    /js/sh/scripts/shBrushCss.js',
        'delphi pascal          /js/sh/scripts/shBrushDelphi.js',
        'diff patch pas         /js/sh/scripts/shBrushDiff.js',
        'erl erlang             /js/sh/scripts/shBrushErlang.js',
        'groovy                 /js/sh/scripts/shBrushGroovy.js',
        'java                   /js/sh/scripts/shBrushJava.js',
        'jfx javafx             /js/sh/scripts/shBrushJavaFX.js',
        'js jscript javascript  /js/sh/scripts/shBrushJScript.js',
        'perl pl                /js/sh/scripts/shBrushPerl.js',
        'php                    /js/sh/scripts/shBrushPhp.js',
        'text plain             /js/sh/scripts/shBrushPlain.js',
        'py python              /js/sh/scripts/shBrushPython.js',
        'ruby rails ror rb      /js/sh/scripts/shBrushRuby.js',
        'sass scss              /js/sh/scripts/shBrushSass.js',
        'scala                  /js/sh/scripts/shBrushScala.js',
        'sql                    /js/sh/scripts/shBrushSql.js',
        'vb vbnet               /js/sh/scripts/shBrushVb.js',
        'xml xhtml xslt html    /js/sh/scripts/shBrushXml.js'
    );

    SyntaxHighlighter.all();

    $.getJSON('/stats', function(stats) {
        $('a.stats > span').html(stats.pastes + " pastes, " + stats.lines + " lines");
        $('section').show();
    });
});
