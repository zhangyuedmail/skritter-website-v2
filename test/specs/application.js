var expect = chai.expect;

describe('Application', function() {
    var application = new (require('application'));

    it('should have valid api credentials', function() {
        var apiDomain = application.get('apiDomain');
        var apiRoot = application.get('apiRoot');
        var apiVersion = application.get('apiVersion');
        expect(apiDomain).to.be.a('string');
        expect(apiRoot).to.be.a('string');
        expect(apiVersion).to.be.a('number');
    });

    it('should have a valid version string', function() {
        var version = application.get('version');
        expect(version).to.be.a('string');
        expect(version).to.not.equal('undefined');
        expect(version).to.not.equal('{!application-version!}');
    });

});
