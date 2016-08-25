const chai = require("chai");
const restify = require("restify");

const config = require("../config");
const testUser = require("./assets/test-user");

const client = restify.createJsonClient({
    version: "*",    // Semver string to set the Accept-Version header to
    url: `http://localhost:${config.PORT}`,
});
const name = "test-user-" + new Date().getTime();
const url = "/user/" + name;
let userRevision;

// GET /user/:name
describe("Getting a nonexistent user", () => {
    let response;
    let responseData;
    before((done) => {
        client.get(url + "-nonexistent", (err, req, res, data) => {
            response = res;
            responseData = data;
            done();
        });
    });
    it("should fail", () => {
        chai.expect(response.statusCode).to.equal(404);
        chai.expect(responseData.code).to.equal("NotFoundError");
        chai.expect(responseData.message).to.equal("User does not exist.");
    });
});

// POST /user/:name
describe("Creating a new user", function () {
    let response;
    let responseData;
    before((done) => {
        client.post(url, (err, req, res, data) => {
            response = res;
            responseData = data;
            userRevision = data.data.rev;    // Needed for update test
            done();
        });
    });
    it("should succeed", () => {
        chai.expect(response.statusCode).to.equal(200);
    });
    it("should return the correct keys", () => {
        chai.expect(responseData).to.have.keys("data");
        chai.expect(responseData.data).to.have.keys("id", "ok", "rev");
    });
    it("should return the correct ID", () => {
        chai.expect(responseData.data.id).to.equal(name);
    });
    it("should return OK", () => {
        chai.expect(responseData.data.ok).to.be.true;
    });
});

// GET /user/:name
describe("Getting a user", () => {
    let response;
    let responseData;
    before((done) => {
        client.get(url, (err, req, res, data) => {
            response = res;
            responseData = data;
            done();
        });
    });
    it("should succeed", () => {
        chai.expect(response.statusCode).to.equal(200);
    });
    it("should return the correct keys", () => {
        chai.expect(responseData).to.have.keys("data");
        chai.expect(responseData.data).to.have.keys("_id", "_rev");
    });
    it("should return the correct ID", () => {
        chai.expect(responseData.data._id).to.equal(name);
    });
});

// PUT /user/:name
describe("Updating a user's data", () => {
    let response;
    let responseData;
    let getResponseData;
    before((done) => {
        testUser._rev = userRevision;
        client.put(url, {data: testUser}, (err, req, res, data) => {
            response = res;
            responseData = data;
            client.get(url, (err, req, res, data) => {
                getResponseData = data;
                done();
            });
        });
    });
    it("should succeed", () => {
        chai.expect(response.statusCode).to.equal(200);
    });
    it("should return the correct keys", () => {
        chai.expect(responseData).to.have.keys("data");
    });
    it("should return the correct ID", () => {
        chai.expect(responseData.data._id).to.equal(name);
    });
    it("should change the document revision", () => {
        chai.expect(responseData.data._rev).to.not.equal(userRevision);
    });
    it("should update the user's data", () => {
        chai.expect(responseData.data).to.include.keys("_id", "_rev",
            ...Object.keys(testUser));
        chai.expect(getResponseData.data).to.include.keys("_id", "_rev",
            ...Object.keys(testUser));
    });
})

// DELETE /user/:name
describe("Deleting a user", () => {
    let response;
    let responseData;
    let getResponse;
    let getResponseData;
    before((done) => {
        client.del(url, (err, req, res, data) => {
            response = res;
            responseData = data;
            client.get(url, (err, req, res, data) => {
                getResponse = res;
                getResponseData = data;
                done();
            });
        });
    });
    it("should succeed", () => {
        chai.expect(response.statusCode).to.equal(200);
    });
    it("should return the correct keys", () => {
        chai.expect(responseData).to.have.keys("data");
        chai.expect(responseData.data).to.have.keys("id", "ok", "rev");
    });
    it("should return the correct ID", () => {
        chai.expect(responseData.data.id).to.equal(name);
    });
    it("should return OK", () => {
        chai.expect(responseData.data.ok).to.be.true;
    });
    it("should delete the user", () => {
        chai.expect(getResponse.statusCode).to.equal(404);
        chai.expect(getResponseData.code).to.equal("NotFoundError");
        chai.expect(getResponseData.message).to.equal("User does not exist.");
    });
});
