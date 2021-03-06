/* global JsonRoutes:false - from simple:json-routes package */
/* global HTTP:false - from http package */
/* global testAsyncMulti:false - from test-helpers package */

var SUCCESS_STATUS_CODE = 200;

if (Meteor.isServer) {
  JsonRoutes.Middleware.use(JsonRoutes.Middleware.parseBearerToken);

  JsonRoutes.add("get", "parse-bearer-token", function (req, res) {
    JsonRoutes.sendResult(res, 200, req.authToken);
  });

  JsonRoutes.add("post", "parse-bearer-token", function (req, res) {
    JsonRoutes.sendResult(res, 200, req.authToken);
  });
}
else { // Meteor.isClient
  var token = 'testToken';

  testAsyncMulti("Middleware - Bearer Token Parser - parse valid headers", [
    function (test, waitFor) {
      HTTP.get (Meteor.absoluteUrl ('/parse-bearer-token'), {
        headers: {authorization: 'Bearer ' + token}
      }, waitFor (function (err, resp) {
        test.equal (err, null);
        test.equal (resp.statusCode, SUCCESS_STATUS_CODE);
        test.equal (resp.data, token);
      }));
    }
  ]);

  testAsyncMulti('Middleware - Bearer Token Parser - parse valid query param', [
    function (test, waitFor) {
      HTTP.get (Meteor.absoluteUrl ('/parse-bearer-token'), {
        query: 'access_token=' + token
      }, waitFor(function (err, resp) {
        test.equal (err, null);
        test.equal (resp.statusCode, SUCCESS_STATUS_CODE);
        test.equal (resp.data, token);
      }));
    }
  ]);
}
