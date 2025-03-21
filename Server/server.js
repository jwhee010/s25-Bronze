// Online, tutorials may refer to this file as index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// This requirement will utilize a MySQL database 
// from the db.js of each individual team member, locally.
const db = require('./config/db');

const jwt = require('jsonwebtoken');  // For creating JWT tokens
const secretKey = 'veryVERYsecret';

// Middleware to verify JWT and get UserID
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);  // Verify the token
        //req.user = decoded;  // Attach the decoded user data to the request
        req.user = { UserID: decoded.UserID };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};



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

                // shove all the user info into a token
                const token = jwt.sign(
                    { 
                        id: user.id, // this is NOT the userID from the database!!! tokens have their own id :)
                        username: user.userName,
                        email: user.email, 
                        firstName: user.firstName,
                        lastName: user.lastName,
                        UserID: user.UserID,
                    }, 
                    secretKey,
                { expiresIn: '1h' }  // Optional: Set an expiration time for the token
            );
                res.status(200).json({ 
                    message: 'Login successful', 

                    token: token,  // Send token
                });
                db.query(update, [username]);
            } else {
                res.status(401).json({ message: 'Login failed. Invalid username or password.' });
            }
        }
    });
});

// retrive food name and expiration date for display on the calendar
// Retrieve food name and expiration date for display on the calendar
app.get('/calendar', verifyToken, async (req, res) => {
    const { UserID } = req.user;

    const sql = `SELECT inventory.Expiration, food_item.FoodName
                 FROM inventory 
                 JOIN food_item ON inventory.FoodItemID = food_item.FoodItemID 
                 WHERE inventory.UserID = ?`;

    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query' });
        }
        
        res.status(200).json({ foodItems: results });
    });
});

// New API route to get food item quantities
app.get('/food-quantity', verifyToken, async (req, res) => {
    const { UserID } = req.user;

    const sql = `SELECT inventory.Quantity, food_item.FoodName 
                 FROM inventory 
                 JOIN food_item ON inventory.FoodItemID = food_item.FoodItemID 
                 WHERE inventory.UserID = ?`;

    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query' });
        }
        
        res.status(200).json({ foodQuantities: results });
    });
});

app.post('/friends/add', verifyToken, (req, res) => {
    if (!req.body || !req.body.friendId) {
        return res.status(400).json({ message: 'Friend ID is required' });
    }

    const { friendId } = req.body;
    const userId = req.user.UserID;

    const sql = `INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`;
    db.query(sql, [userId, friendId], (error, result) => {
        if (error) return res.status(500).json({ message: 'Error adding friend' });
        res.status(200).json({ message: 'Friend added successfully' });
    });
});


app.delete('/friends/remove', verifyToken, (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.UserID;

    const sql = `DELETE FROM friends WHERE user_id = ? AND friend_id = ?`;
    db.query(sql, [userId, friendId], (error, result) => {
        if (error) return res.status(500).json({ message: 'Error removing friend' });
        res.status(200).json({ message: 'Friend removed successfully' });
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

// update status of a given item to consumed
app.post('/consumeFood', verifyToken, (req, res) => {
    const { InventoryID } = req.body;
    const { UserID } = req.user;

    if (!InventoryID) {
        return res.status(400).json({ message: 'InventoryID is required' });
    }

    const updateQuery = `
        UPDATE inventory 
        SET ExpirationStatus = 'consumed' 
        WHERE InventoryID = ? AND UserID = ?;
    `;

    db.query(updateQuery, [InventoryID, UserID], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error updating food status' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Food item not found or already consumed' });
        }

        res.status(200).json({ message: 'Food item status updated to consumed successfully' });
    });
});


// Server Setup
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});