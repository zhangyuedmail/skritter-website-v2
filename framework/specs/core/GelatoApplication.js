define([], function() {
    describe("framework/GelatoApplication", function() {

        beforeEach(function() {
            $("body").append("<div class='gelato-content'></div>");
        });

        describe("getContainer", function() {
            it("should return the application id selector", function() {
                expect(app.getContainer().selector).toBe("#application");
            });
        });
        describe("getContentHeight", function() {

            it("should return a numeric value", function() {
                expect(app.getContentHeight()).toEqual(jasmine.any(Number));
            });

        });
        describe("getContentWidth", function() {
            it("should return a numeric value", function() {
                expect(app.getContentWidth()).toEqual(jasmine.any(Number));
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

        afterEach(function() {
            $(".gelato-content").remove();
        });

    });
});