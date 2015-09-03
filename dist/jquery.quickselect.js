;(function ( $, window, document, undefined ) {

	"use strict";

	// Create the defaults once
	var pluginName = "quickselect",
		defaults = {
			activeButtonClass: 'active', // added to active/selected button
			breakOutValues: [], // options to break out of select box
			buttonClass: '', // added to each button
			namespace: 'quickselect', // CSS prepend: namespace_class
			selectDefaultText: 'More&hellip;', // text to display on select button
			wrapperClass: '' // class on wrapping div
		};

	// The actual plugin constructor
	function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		init: function () {
			var el                = this.element,
				activeButtonClass = this.settings.activeButtonClass,
				breakOutValues    = this.settings.breakOutValues,
				buttonClass       = this.settings.buttonClass,
				currentTxt        = $(el).find('option:selected').text(),
				currentVal        = $(el).val(),
				namespace         = this.settings.namespace,
				selectDefaultText = this.settings.selectDefaultText,
				wrapperClass      = this.settings.wrapperClass;

			// Scaffolding
			$(el).addClass(namespace + '__select');
			$(el).wrap('<div class="' + namespace + '__wrapper ' + wrapperClass + '"></div>');
			var wrapper = $(el).parent();
			$(el).wrap('<div class="' + namespace + '__btn ' + namespace + '__more ' + buttonClass + '"></div>');
			$('.' + namespace + '__more', $(wrapper)).append(
				'<span class="' + namespace + '__more--label">' + selectDefaultText + '</span>'
			);

			// Reverse array direction for prepending
			breakOutValues.reverse();

			// Add buttons
			$.each(breakOutValues, function(index, value){
				var opVal = $(  'option[value="' + value + '"]', el ).attr('value'),
					opTxt = $(  'option[value="' + value + '"]', el ).text();

				$(wrapper)
					.prepend('<span data-' + namespace + '-value="' + opVal + '" class="' + namespace + '__btn ' + buttonClass + '">' + opTxt + '</span>');
			});

			
			

			// On select option change
			$(el).change(function() {
				var value = $(this).val();

				// reset active classes
				$('.' + namespace + '__btn, .' + namespace + '__more', $(wrapper)).removeClass(activeButtonClass);

				// empty value
				if (value=='') {
					// More-button label
					$('.' + namespace + '__more--label', $(wrapper)).html(selectDefaultText);
				}
				// if option's value is a breakout button
				else if ( jQuery.inArray(value, breakOutValues) !== -1 ) {
					// Button active
					$('.' + namespace + '__btn[data-' + namespace + '-value="' + value + '"]', $(wrapper)).addClass(activeButtonClass);

					// More-button label
					$('.' + namespace + '__more--label', $(wrapper)).html(selectDefaultText);
				}
				// else option must reside only in select dropdown
				else {
					// More-button label
					$('.' + namespace + '__more--label', $(wrapper)).html(
						$('.' + namespace + '__select', $(wrapper)).find('option:selected').text()
					);
					// More-button active
					$('.' + namespace + '__more', $(wrapper)).addClass(activeButtonClass);
				}
			});

			// On button click trigger change
			$('.' + namespace + '__btn[data-quickselect-value]', $(wrapper)).click(function() {
				if ( $(this).hasClass(activeButtonClass) ) {
					$(el).val($("option:first", el).val()).change();
				} else {
					$(el).val($(this).attr('data-' + namespace + '-value')).change();
				}
			});

			// Tigger change on load
			$(el).val(currentVal).change();
			
		}
	});

	$.fn[ pluginName ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + pluginName ) ) {
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );