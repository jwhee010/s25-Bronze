// Online, tutorials may refer to this file as index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// This requirement will utilize a MySQL database 
// from the db.js of each individual team member, locally.
const db = require('./config/db');

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM user WHERE username = ? AND passwordHash = ?';
    const update = 'UPDATE user SET lastLogin = NOW() WHERE UserName = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'An error occurred while processing your request.' });
        } else {
            if (result.length > 0) {

                // the user info is stored in this
                const user = result[0];

                res.status(200).json({ 
                    message: 'Login successful', 

                    // this returns the user's first and last name.
                    // in theory, a similar method should work for other 
                    // objects, such as inventorys or food items.
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
                db.query(update, [username]);
            } else {
                res.status(401).json({ message: 'Login failed. Invalid username or password.' });
            }
        }
    });
});

































































































































































// Add or update quantity of Food Item in Inventory and display updated Inventory
app.post('/addOrUpdateFood', (req, res) => {
    const { InventoryID, UserID, FoodID, PurchaseDate, Quantity, Expiration, Storage, ExpirationStatus, SharingStatus } = req.body;

    const query = `
    INSERT INTO inventory (InventoryID, UserID, FoodID, PurchaseDate, Quantity, Expiration, Storage, ExpirationStatus, SharingStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) AS new
    ON DUPLICATE KEY UPDATE
        UserID = new.UserID,
        FoodID = new.FoodID,
        PurchaseDate = new.PurchaseDate,
        Quantity = inventory.Quantity + new.Quantity,
        Expiration = new.Expiration,
        Storage = new.Storage,
        ExpirationStatus = new.ExpirationStatus,
        SharingStatus = new.SharingStatus;
    SELECT * FROM livelyshelfsdb.inventory;
    `;

    db.query(query, [InventoryID, UserID, FoodID, PurchaseDate, Quantity, Expiration, Storage, ExpirationStatus, SharingStatus], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'An error occurred while adding or updating the food item.' });
        } else {
            res.status(200).json({ message: 'Food item added or updated successfully.' });
        }
    });
});

// Remove quantity of Food Item from Inventory and display updated Inventory
app.post('/removeFoodQuantity', (req, res) => {
    const { InventoryID, UserID, FoodID, quantityToRemove } = req.body;

    const updateQuery = `
        UPDATE inventory 
            SET Quantity = Quantity - ?
            WHERE InventoryID = ? AND UserID = ? AND FoodID = ?;
        SELECT * FROM livelyshelfsdb.inventory;
    `;

    db.query(query, [InventoryID], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'An error occurred while removing the food from inventory.' });
        } else {
            res.status(200).json({ message: 'Food removed from inventory successfully.' });
        }
    });
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});