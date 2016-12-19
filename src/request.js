"use strict";
const request = require('request');

const session_key_url = 'https://semantria.com/auth/session';
const API_KEY = "";
const API_SECRET = "";

module.exports = function (app) {
    app.get('/', function (req, res) {
        let request = {
            oAuth: {
                consumerKeyKey: "oauth_consumer_key",
                signatureKey: "oauth_signature",
                nonceKey: "oauth_nonce"
            }
        }
    })


    var api_request = {
        oAuth: {
            version: "1.0",
            parameterPrefix: "oauth_",
            consumerKeyKey: "oauth_consumer_key",
            versionKey: "oauth_version",
            signatureMethodKey: "oauth_signature_method",
            signatureKey: "oauth_signature",
            timestampKey: "oauth_timestamp",
            nonceKey: "oauth_nonce"
        },
        SDK_VERSION: session.SDK_VERSION,
        X_API_VERSION: session.X_API_VERSION,
        API_HOST: session.API_HOST,
        consumerKey: session.consumerKey,
        consumerSecret: session.consumerSecret,
        applicationName: session.applicationName,
        onRequest: session.onRequest,
        onResponse: session.onResponse,
        onError: session.onError,
        onAfterResponse: session.onAfterResponse,
        format: session.format,
        nonce: generateNonce(),
        timestamp: generateTimestamp(),
        session: session
    }
    api_request.method     = options.method     || 'GET';
    api_request.path       = options.path       || '';
    api_request.getParams  = options.getParams  || {};
    api_request.postParams = options.postParams || null;
    api_request.url        = generateUrl(api_request);
    api_request.queryUrl   = generateQueryUrl(api_request);
    api_request.headers    = getRequestHeaders(api_request);
    api_request.callAfterResponseHook = options.callAfterResponseHook;

    function generateQueryUrl(api_request) {
        api_request.getParams[api_request.oAuth.consumerKeyKey]     = api_request.consumerKey;
        api_request.getParams[api_request.oAuth.nonceKey]           = api_request.nonce;
        api_request.getParams[api_request.oAuth.signatureMethodKey] = "HMAC-SHA1";
        api_request.getParams[api_request.oAuth.timestampKey]       = api_request.timestamp;
        api_request.getParams[api_request.oAuth.versionKey]         = api_request.oAuth.version;

        var queryStr = createQueryString(api_request.getParams);
        var url = api_request.API_HOST + '/' + api_request.path + '.' + api_request.format;
        url += queryStr;

        return url;
    }

    function generateUrl(api_request) {
        var queryStr = createQueryString(api_request.getParams);
        var url = api_request.API_HOST + '/' + api_request.path + '.' + api_request.format;
        url += queryStr;

        return url;
    }

};