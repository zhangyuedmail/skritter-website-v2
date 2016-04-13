var expect = chai.expect;

describe('Functions', function() {
	var fn = require('functions');

	describe('convertBytesToSize', function() {
		it('should convert bytes to kilobytes', function() {
			expect(fn.convertBytesToSize(1024)).to.equal('1.00 KB');
		});
		it('should convert bytes to megabytes', function() {
			expect(fn.convertBytesToSize(1048576)).to.equal('1.00 MB');
		});
	});

});
