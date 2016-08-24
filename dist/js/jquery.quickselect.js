/*! quickselect - v2.2.0 - 2016-08-24
* http://quick-select.eggbox.io/
* Copyright (c) 2016 Will Stone; Licensed MIT */
(function (factory) {
  /*global define: false, require: false */
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
} (function ($, window, document, undefined) {

  "use strict";

  // Create the defaults once
  var pluginName = "quickselect",
    defaults = {
      activeButtonClass: 'active', // added to active/selected button
      breakOutAll: false,
      breakOutValues: [], // options to break out of select box
      buttonClass: '', // added to each button
      buttonDefaultClass: '', // added to each button if select box is not a required field
      buttonRequiredClass: '', // added to each button if select box is a required field
      namespace: pluginName, // CSS prepend: namespace_class
      selectDefaultText: 'More&hellip;', // text to display on select button
      wrapperClass: '', // class on wrapping div
      buttonTag: 'button', // button tag
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }


  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      var el = this.element,
        activeButtonClass = this.settings.activeButtonClass,
        breakOutAll = this.settings.breakOutAll,
        breakOutValues = this.settings.breakOutValues,
        buttonClass = this.settings.buttonClass,
        buttonDefaultClass = this.settings.buttonDefaultClass,
        buttonRequiredClass = this.settings.buttonRequiredClass,
        namespace = this.settings.namespace,
        selectDefaultText = this.settings.selectDefaultText,
        wrapperClass = this.settings.wrapperClass,
        buttonTag = this.settings.buttonTag;

      // Select element wrapper
      var wrapper = $('<div class="' + namespace + '__wrapper ' + wrapperClass + '"></div>');
      $(el).addClass(namespace + '__select').before(wrapper);

      // if breakOutAll true then set breakOutValues array to all options
      breakOutValues = (breakOutAll) ? $('option', el).map(function () { return this.value; }).get() : breakOutValues;

      // Adding disabled status to buttons
      var disabled = ($(el).is(":disabled") ? " disabled " : "");

      // Consolidate button classes
      var btnClass = buttonClass + ' ' + ($(el).is(":required") ? buttonRequiredClass : buttonDefaultClass);

      // Add buttons
      $.each(breakOutValues, function (index, value) {
        var opVal = $('option[value="' + value + '"]', el).attr('value'),
          opTxt = $('option[value="' + value + '"]', el).text();

        if (opVal) {
          $(wrapper)
            .append(
            '<' + buttonTag + ' aria-pressed="false" data-' + namespace + '-value="' + opVal + '" class="' + namespace + '__btn ' + btnClass + '"' + disabled + '>' + opTxt + '</' + buttonTag + '>'
            );
        }
      });


      if (breakOutAll) {
        // Hide select overflow as all elements have been broken out. Can't use display none as
        // the value will not be submitted.
        $(el).addClass(namespace + '__hidden');
      } else {
        // move select box inside wrapper
        $(el)
          .wrap('<div class="' + namespace + '__btn ' + namespace + '__more ' + btnClass + '"' + disabled + '></div>')
          .before('<span class="' + namespace + '__more--label">' + selectDefaultText + '</span>')
          .parent()
          .detach()
          .appendTo(wrapper);
      }


      // On select option change
      $(el).change(function () {
        var value = $(this).val();

        // reset active classes
        $('.' + namespace + '__btn', $(wrapper)).removeClass(activeButtonClass);

        var moreButtonLabel = selectDefaultText;

        // if option's value is a breakout button
        if ($.inArray(value, breakOutValues) !== -1 || breakOutAll === true) {
          // Button active
          $('.' + namespace + '__btn[data-' + namespace + '-value="' + value + '"]', $(wrapper)).addClass(activeButtonClass);
        }
        // else option must reside only in overflow
        else if (value) {
          // More-button label
          moreButtonLabel = $(el).find('option:selected').text();
          // More-button active
          $('.' + namespace + '__more', $(wrapper)).addClass(activeButtonClass);
        }

        // Set More-button label
        $('.' + namespace + '__more--label', $(wrapper)).html(moreButtonLabel);
      });

      // On button click trigger change
      $('.' + namespace + '__btn[data-' + namespace + '-value]', $(wrapper)).click(function () {
        if ($(this).hasClass(activeButtonClass)) {
          $(el).val($("option:first", el).val()).change();
        } else {
          $(el).val($(this).attr('data-' + namespace + '-value')).change();
        }
      });

      // Trigger change on load
      $(el).val($(el).val()).change();

      // For keyboard navigation: show (opacity=1) original select box when focused
      $(el).focus(function () {
        $(this).css('opacity', '1');
      }).blur(function () {
        $(this).css('opacity', '0');
      });

    }
  });


  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
}));
