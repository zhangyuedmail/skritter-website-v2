define([], function() {
    describe("framework/Gelato", function() {
        describe("getVersion", function() {
            it("should return a properly formatted version string", function() {
                expect(gelato.getVersion().split(".").length).toEqual(3);
            });
        });
        describe("isLocal", function() {
            it("should return boolean based on location hostname", function() {
                if (document.location.hostname === "localhost") {
                    expect(gelato.isLocal()).toEqual(true);
                } else {
                    expect(gelato.isLocal()).toEqual(false);
                }
            });
        });
        describe("isNative", function() {
            it("should return boolean based on location protocol", function() {
                if (document.location.protocol === "file:") {
                    expect(gelato.isNative()).toEqual(true);
                } else {
                    expect(gelato.isNative()).toEqual(false);
                }
            });
        });
    });
});