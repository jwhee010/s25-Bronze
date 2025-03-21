const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const db = require('../config/db');
const app = require('../server');

//I assume we'll be installing the dependancies in the main branch so I didn't do it here

describe('Food Inventory', () => {
    let queryStub;
    let req, res;

    beforeEach(() => {
        queryStub = sinon.stub(db, 'query');
        req = { body: {} };
        res = { 
            status: sinon.stub().returnsThis(), 
            json: sinon.stub()
        };
    });

    afterEach(() => {
        queryStub.restore();
    });

    //Placeholder values because I didn't know what the exact format for the dates and all that were
    describe('addOrUpdateFood', () => {
        it('should add/update a food item successfully', (done) => {
            req.body = {
                InventoryID: 1,
                UserID: 2,
                FoodID: 3,
                PurchaseDate: '3/12/25',
                Quantity: 5,
                Expiration: '6/12/25',
                Storage: 'Pantry',
                ExpirationStatus: 'Fresh',
                SharingStatus: 'Private'
            };

            queryStub.yields(null, [{ affectedRows: 1 }]);

            const addOrUpdateFood = require('../server').addOrUpdateFood;
            addOrUpdateFood(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Food item added/updated successfully.' })).to.be.true;
            done();
        });
    });

    describe('removeFoodQuantity', () => {
        it('should remove food quantity successfully', (done) => {
            req.body = {
                InventoryID: 1,
                UserID: 2,
                FoodID: 3,
                quantityToRemove: 2
            };

            queryStub.yields(null, [{ affectedRows: 1 }]);

            const removeFoodQuantity = require('../server').removeFoodQuantity;
            removeFoodQuantity(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: 'Food removed from inventory successfully.' })).to.be.true;
            done();
        });
    });
});