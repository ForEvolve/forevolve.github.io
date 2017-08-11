(function ($) {
    // DOM ready
    $(function () {
        // All external links should be opened in a new tab.
        $('a[href^="http://"], a[href^="https://"], a[href^="//"]').attr('target', '_blank');
    });
}(jQuery));
