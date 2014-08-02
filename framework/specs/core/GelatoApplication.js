define([], function() {
    describe("framework/GelatoApplication", function() {
        describe("getContainer", function() {
            it("should return the application id selector", function() {
                expect(app.getContainer().selector).toBe("#application");
            });
        });
        describe("getHeight", function() {
            it("should return a numeric value", function() {
                expect(app.getHeight()).toEqual(jasmine.any(Number));
            });
        });
        describe("getWidth", function() {
            it("should return a numeric value", function() {
                expect(app.getWidth()).toEqual(jasmine.any(Number));
            });
        });
    });
});