const chai = require("chai");
const restify = require("restify");

const config = require("../config");
const testMessage = require("./assets/test-message");

const client = restify.createJsonClient({
    version: "*",    // Semver string to set the Accept-Version header to
    url: `http://localhost:${config.PORT}`,
});
const url = "/message";

// PUT /message
describe("Updating the message document", () => {
    let originalMessage;
    let response;
    let responseData;
    let revision;
    before((done) => {
        // Get original message contents and revision
        client.get(url, (err, req, res, data) => {
            revision = data.data._rev;
            testMessage._rev = revision;
            originalMessage = data.data;
            // Update document with test data
            client.put(url, {data: testMessage}, (err, req, res, data) => {
                response = res;
                responseData = data;
                done();
            });
        });
    });
    it("should succeed", () => {
        chai.expect(response.statusCode).to.equal(200);
    });
    it("should return the correct keys", () => {
        chai.expect(responseData).to.have.keys("data");
        chai.expect(responseData.data).to.have.keys("_id", "_rev", "active",
                                                    "body", "title");
    });
    it("should change the document revision", () => {
        chai.expect(responseData.data._rev).to.not.equal(revision);
    });
    it("should update the message", () => {
        chai.expect(responseData.data.title).to.equal(testMessage.title);
        chai.expect(responseData.data.body).to.equal(testMessage.body);
        chai.expect(responseData.data.active).to.equal(testMessage.active);
    });
    after("Reset message to previous value", (done) => {
        originalMessage._rev = responseData.data._rev;
        client.put(url, {data: originalMessage}, done);
    });
});
