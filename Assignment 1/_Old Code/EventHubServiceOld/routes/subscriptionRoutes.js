'use strict';

// Module dependencies
const express = require('express');
const router = express.Router();
const async = require('async');
const Subscription = require('./../models/subscription');
const dataTransformer = require('./../utilities/dataTransformer');

router.get('/', (req, res) => {
	Subscription.find({}, (err, result) => {
		if(err) {
			return res.status(500).json(dataTransformer.transformError(500, err.message));
		}
		return res.status(200).json(dataTransformer.transformSubscription(result));
	});
});

router.get('/:id', (req, res) => {
	Subscription.findOne({subscriptionID: req.params.id}, (err, subscription) => {
		if(err) {
			return res.status(500).json(dataTransformer.transformError(500, err.message));
		}

		if(!subscription) {
			return res.status(404).json(dataTransformer.transformError(404, "A resource with the specified ID does not exist."));
		} else {
			return res.status(200).json(dataTransformer.transformSubscription(subscription));
		}
	});
});

router.delete('/:id', (req, res) => {
	Subscription.findOne({subscriptionID: req.params.id}, (err, subscription) => {
		if(err) {
			return res.status(500).json(dataTransformer.transformError(500, err.message));
		}

		if(!subscription) {
			return res.status(404).json(dataTransformer.transformError(404, "A resource with the specified ID does not exist."));
		} else {
			subscription.remove((err) => {
				if(err) {
					return res.status(500).json(dataTransformer.transformError(500, err.message));
				}
				return res.status(204).end();
			})
		}
	});
});

router.put('/:id', (req, res) => {
	// Check if the user sent the event in the request body.
	// If not, return 400 Bad request error.
    if (!req.body || !req.body.callback) {
        return res.status(400).json(dataTransformer.transformError(400, "Bad Request, The required parameter 'callback' is not present. The POST method must have the data(JSON) in the Request body"));
    }

    // Check if the user sent the events array in the body.
    // If he sent the events, validate if its an array
    if(req.body.events && req.body.events.constructor !== Array) {
    	return res.status(400).json(dataTransformer.transformError(400, "Bad Request, The parameter 'event' is not an Array. The POST method must have the data(JSON) in the Request body"));
    }

	Subscription.findOne({subscriptionID: req.params.id}, (err, subscription) => {
		if(err) {
			return res.status(500).json(dataTransformer.transformError(500, err.message));
		}

		if(!subscription) {
			return res.status(404).json(dataTransformer.transformError(404, "A resource with the specified ID does not exist."));
		} else {
			subscription.callback = req.body.callback,
			subscription.events = req.body.events
			subscription.save((err, result) => {
				if (err) {
					return res.status(500).json(dataTransformer.transformError(500, err.message));
				}
				return res.status(200).json(dataTransformer.transformSubscription(result));
			})
		}
	});
});

router.post('/', (req, res) => {
	// Check if the user sent the event in the request body.
	// If not, return 400 Bad request error.
    if (!req.body || !req.body.callback) {
        return res.status(400).json(dataTransformer.transformError(400, "Bad Request, The required parameter 'callback' is not present. The POST method must have the data(JSON) in the Request body"));
    }

    // Check if the user sent the events array in the body.
    // If he sent the events, validate if its an array
    if(req.body.events && req.body.events.constructor !== Array) {
    	return res.status(400).json(dataTransformer.transformError(400, "Bad Request, The parameter 'event' is not an Array. The POST method must have the data(JSON) in the Request body"));
    }

	Subscription.findOne({callback: req.body.callback}, (err, data) => {
		if(err) {
			return res.status(500).json(dataTransformer.transformError(500, err.message));
		}

		if(data) {
			return res.status(409).json(dataTransformer.transformError(409, "A resource with the specified callback already exists. To update this resource do a PUT instead of POST."));
		} else {
			let subscription = new Subscription({
				callback: req.body.callback,
				events: req.body.events
			});
			subscription.save((err, result) => {
				if (err) {
					return res.status(500).json(dataTransformer.transformError(500, err.message));
				}
				return res.status(201).json(dataTransformer.transformSubscription(result));
			})
		}
	});
});

module.exports = router;
