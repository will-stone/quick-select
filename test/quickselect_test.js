(function ($) {
	module('jQuery#quickSelect', {
		setup: function () {
			this.elem = $('#qs-test-1');
			// this.elems = $('#qunit-fixture').children();
		}
	});

	test('more button', function () {
		expect(1);
		strictEqual(this.elem.quickselect(
			{
				breakOutValues: ['Breakfast', 'Lunch']
			}
		).parent().hasClass('quickselect__btn quickselect__more'), true, 'should be "quickselect__btn quickselect__more"');
	});

}(jQuery));
