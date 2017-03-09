window.expect = chai.expect;
window.assert = chai.assert;
window.hasFocus = function(elem) {
	return !!(elem === document.activeElement);
};

var sandbox = document.createElement('form');
document.body.appendChild(sandbox);

window.setupTest = function(html, options, callback) {
	if (window.testLast) window.testLast.teardown();

	var $select = $(html).appendTo(sandbox).selectize(options);
	var instance = $select[0].selectize;
	var test = window.testLast = {
		$select: $select,
		callback: callback,
		selectize: instance,
		teardown: function() {
			instance.destroy();
			$select.remove();
			window.testLast = null;
		}
	};

	return test;
};

after(function() {
	if (window.testLast) {
		window.testLast.teardown();
	}
});

$(sandbox).on('submit', function(e) { e.preventDefault(); });
