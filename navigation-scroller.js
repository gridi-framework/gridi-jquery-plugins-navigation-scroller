(function ( $ ) {
    'use strict';

    var NavScroller = function(element, options) {
        var windowElement = $(window);
        var documentElement = $(document);
        var htmlBodyElement = $('html, body');
        var navScrollerElement = $(element);
        var targetElement, targetAttributeValue, attributeForFindTargetElement;

        var settings = $.extend(true, {
            attributeForFindTargetElement: 'href',
            targetElementAttribute: 'id',
            updateHistory: true,
            topSpace: 0, // int topSpace: value | function topSpace: function() { return (int) topSpace }
            animateDuration: 400,
            animateFunction: 'linear',
            elements: {
                targetElement: false,
            },
            classes: {
                targetIsOnScrollPosition: 'target-is-on-scroll-position'
            }
        }, options);

        if($.type(settings.elements.targetElement) === 'string' || $.type(settings.elements.targetElement) === 'object') {
            targetElement = $(settings.elements.targetElement);
        } else {
            attributeForFindTargetElement = navScrollerElement.attr(settings.attributeForFindTargetElement);

            if ( attributeForFindTargetElement !== null && attributeForFindTargetElement !== '' ) {
                attributeForFindTargetElement = attributeForFindTargetElement.replace( /^#/, '' );
                targetElement = $('[' + settings.targetElementAttribute + '="' + attributeForFindTargetElement + '"]');
            }
        }

        if($.type(targetElement) === 'object' && targetElement.length > 0) {
            targetElement = targetElement.first();
            if(settings.updateHistory === true) {
                targetAttributeValue = targetElement.attr(settings.targetElementAttribute);
                if ( attributeForFindTargetElement !== null && attributeForFindTargetElement !== '' ) {
                    targetAttributeValue = targetAttributeValue.replace( /^#/, '' );
                    navScrollerElement.on('end-scrolling', eventUpdateHistory);
                }
            }

            navScrollerElement.on('click', eventScroll);
            $(window).on('scroll', eventUpdateClass);

        }

        function getTopSpace() {
            if($.type(settings.topSpace) === 'function') {
                return settings.topSpace();
            }

            return settings.topSpace;
        }

        function eventScroll(event) {
            event.preventDefault();
            event.stopPropagation();
            navScrollerElement.trigger('start-scrolling');

            htmlBodyElement.animate({
                scrollTop: targetElement.offset().top - getTopSpace()
            }, settings.animateDuration, settings.animateFunction, function() {
                navScrollerElement.trigger('end-scrolling');
            } );
        }

        function eventUpdateHistory() {
            location.hash = targetAttributeValue;
        }

        function eventUpdateClass() {
            var currentScrollTop = documentElement.scrollTop();
            var targetOffsetTop = targetElement.offset().top;

            if( currentScrollTop >= (targetOffsetTop - getTopSpace()) && currentScrollTop <= (targetOffsetTop + targetElement.outerHeight())) {
                if(!navScrollerElement.hasClass(settings.classes.targetIsOnScrollPosition)) {
                    navScrollerElement.addClass(settings.classes.targetIsOnScrollPosition);
                }
            } else {
                if(navScrollerElement.hasClass(settings.classes.targetIsOnScrollPosition)) {
                    navScrollerElement.removeClass(settings.classes.targetIsOnScrollPosition);
                }
            }
        }
    };

    //Initialize jQuery function
    $.fn.navigationScroller = function() {
        var navScrollerElements = this;
        var i;

        for (i = 0; i < navScrollerElements.length; i++) {
            var navScrollerElement = navScrollerElements[i];

            if(!(navScrollerElement.navScroller instanceof NavScroller)) {
                navScrollerElement.navScroller = new NavScroller(navScrollerElement, arguments[0]);
            }
        }

        return navScrollerElements;
    };

}( jQuery ));
