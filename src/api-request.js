var session_key_url = 'https://semantria.com/auth/session';

function runApiRequest(session, options) {
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
    };
    api_request.method     = options.method     || 'GET';
    api_request.path       = options.path       || '';
    api_request.getParams  = options.getParams  || {};
    api_request.postParams = options.postParams || null;
    api_request.url        = generateUrl(api_request);
    api_request.queryUrl   = generateQueryUrl(api_request);
    api_request.headers    = getRequestHeaders(api_request);
    api_request.callAfterResponseHook = options.callAfterResponseHook;

    api_request.onRequest.call(api_request.session, {
        method: api_request.method,
        url: api_request.url,
        message: api_request.postParams
    });

    var request_fn;
    if (typeof options.callback == "function") {
        request_fn = runAsyncRequest;
    } else {
        request_fn = options.callback ? runPromiseRequest : runSyncRequest;
    }
    return request_fn(api_request, options.callback);
}
SemantriaActiveSession.getConfigurations(true)
.then(function(configurations) {
	for (var i=0; i<configurations.length; i++) {
		if (configurations[i].name == appConfigurationName) {
			return promise.resolve([configurations[i]]);
		}
	}
	return SemantriaActiveSession.addConfigurations([{
		name: appConfigurationName,
		is_primary: false,
		auto_response: false,
		language: "English"
	}], true);
})
.then(function(result){
	appConfigurationId = result[0].id;
	return SemantriaActiveSession.getSubscription(true);
})
.then(function(subscription){
	var outgoingBatches = getOutgoingBatches(subscription.basic_settings.batch_limit);
	var requests = [];
	for (var i=0; i<outgoingBatches.length; i++) {
		(function(outgoingBatch){
			var rq = SemantriaActiveSession.queueBatchOfDocuments(outgoingBatches[i], appConfigurationId, true)
				.then(function(res){
					console.log("%d documents queued successfully", outgoingBatch.length);
				});
			requests.push(rq);
		})(outgoingBatches[i]);
	}
	return promise.all(requests);
})
.then(function(){
	//wait processing of all documents
	return new promise(function(resolve, reject) {
		var analyticData = [];
		var wait_fn = function () {
			console.log("Retrieving your processed results...");
			SemantriaActiveSession.getProcessedDocuments(appConfigurationId, true)
			.then(function(processedDocuments) {

				if (processedDocuments && processedDocuments.length) {
					for (var i=0, res; res=processedDocuments[i]; i++) {
						if (res.id in docsTracker) {
							docsTracker[res.id] = true;
							analyticData.push(res);
						}
					}
				}

				var flag = true;
				for (var item in docsTracker) {
					if (!docsTracker[item]) {
						flag = false;
						break;
					}
				}

				if (flag) {
					return resolve(analyticData);
				}

				setTimeout(wait_fn, 2000);
			});
		}
		setTimeout(wait_fn, 2000);
	});
})
.then(function(analyticData) {
	for(var i=0, data;data=analyticData[i];i++) {
		// Printing of document sentiment score
		console.log("Document %s. Sentiment score: %s", data.id, data.sentiment_score);

		// Printing of document themes
		console.log("  Document themes:");
		if (data.themes) {
			for(var j=0, theme; theme=data.themes[j]; j++) {
				console.log("    %s (sentiment: %s)", theme.title, theme.sentiment_score);
			}
		} else {
			console.log("    No themes were extracted for this text");
		}

		// Printing of document entities
		console.log("  Entities:");
		if (data['entities']) {
			for(var j=0, entity; entity=data['entities'][j]; j++) {
				console.log("    %s (sentiment: %s)", entity.entity_type, entity.sentiment_score);
			}
		} else {
			console.log("    No entities were extracted for this text");
		}

		// Printing of document entities
		console.log("  Topics:");
		if (data.topics) {
			for(var j=0, topic; topic=data.topics[j]; j++) {
				console.log("    %s : %s (strength: %s)", topic.title, topic.type, topic.sentiment_score);
			}
		} else {
			console.log("    No topics were extracted for this text");
		}
	}

})