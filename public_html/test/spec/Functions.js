define([
    'Functions'
], function(Functions) {
    describe('Functions', function() {
        describe('getUnixTime', function() {
            it('milliseconds to be greater than seconds', function() {
                var milliseconds = Functions.getUnixTime(true);
                var seconds = Functions.getUnixTime();
                expect(milliseconds).toBeGreaterThan(seconds);
            });
            it('should always be an integer', function() {
                var milliseconds = Functions.getUnixTime(true);
                var seconds = Functions.getUnixTime();
                expect(milliseconds).toEqual(jasmine.any(Number));
                expect(seconds).toEqual(jasmine.any(Number));
                expect(milliseconds.toString()).not.toContain('.');
                expect(seconds.toString()).not.toContain('.');
            });
        });        
    });
});