// Uses jasmine for unit testing
// TO TEST: ./node_modules/jasmine-node/bin/jasmine-node tests/orderSpec.js

// Directive that prevents the use of undeclared variables
// also prevents multiple declarations in same scope, 
// duplicate params, etc "http://www.w3schools.com/js/js_strict.asp"
'use strict';

// location of tested function
var order = require('../data/order');

// Id generated by MongoDB 
var _id;

// 'describe' blocks describes several behaviors within objects or functions...
// in this case it is testing functionality within the order module
// NOTE: closing the database happens only once at the end
describe('Testing the order.js methods', function() {

	// 'it' blocks describe a single behavior within a function

	// This block tests the functionality of the 'createOrder' function
	// NOTE: The 'done' parameter is for jasmine to know when the test is done
	it('Create order should return success', function(done) { 
		require('../data/connection')(function(err, db) {
			var Order = order(db);
			Order.createOrder("test_location", 1.23, "test_entree", "test_bev", { side1: "side_1", side2: "side_2" })
			.then(function (res) { // .then is part of 'q' library returned promise
				_id = res[0].id;
				// Gets the location of the order to check it is correct
				expect(res[0].location).toEqual('test_location'); 
				// Gets the price of the order to make sure it is correct
				expect(res[0].price).toEqual(1.23);
				done(); // Async returned so call 'done'
			});
		});
	});
	
	// This block tests the functionality of the 'closeOrder' function
	// NOTE: The 'done' parameter is for jasmine to know when the test is done
	it('Close order should return success', function(done) {
		require('../data/connection')(function(err, db) {
			var Order = order(db);
			Order.closeOrder(_id)
			.then(function (res) { // .then is part of 'q' library returned promise
				expect(res).toEqual(1); // Only 1 entry should change
				done(); // Async returned so call 'done'
			});
		});
	});
	
	// This block tests the functionality of the 'cancellOrder' function
	// NOTE: The 'done' parameter is for jasmine to know when the test is done
	it('Cancel order should return success', function(done) {
		require('../data/connection')(function(err, db) {
			var Order = order(db);
			Order.cancellOrder(_id)
			.then(function (res) { // .then is part of 'q' library returned promise
				expect(res).toEqual(1); // Only 1 entry should change
				done(); // Async returned so call 'done'
			});
		});
	});
	
	// This block tests the functionality of the 'getLocationOrders' function
	// NOTE: The 'done' parameter is for jasmine to know when the test is done
	it('Pulling orders should return success', function(done) {
		require('../data/connection')(function(err, db) {
			var Order = order(db);
			Order.getLocationOrders('test_location')
			.then(function (res) { // .then is part of 'q' library returned promise
				// Test that an entry has the entree 'test_entree' field like it should
				expect(res[0].entree).toEqual('test_entree');
				// Closes the database connection
				db.close();
				done(); // Async returned so call 'done'
			});
		});
	});
	
});