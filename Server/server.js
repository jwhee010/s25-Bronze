// Online, tutorials may refer to this file as index.js

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

//********************************************************* */

//Real Time Messaging Websocket
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

//********************************************************** */

// This requirement will utilize a MySQL database 
// from the db.js of each individual team member, locally.
const db = require('./config/db');

const jwt = require('jsonwebtoken');  // For creating JWT tokens
const { error } = require('console');
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

    const sql = `SELECT inventory.Quantity, inventory.Expiration, food_item.FoodName
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
// ------------------- FRIEND ROUTES - ---------------------

app.get('/friends', verifyToken, (req, res) => {
    const {UserID} = req.user;
  
    const sql = `
    SELECT 
		u.UserID,
		u.userName,
		u.firstName,
		u.lastName
	FROM
		shelf_friend s
		join user u on s.UserID_2 = u.UserID
	WHERE
		UserID_1 = ? AND FriendStatus = 'yes'
    `;
  
    db.query(sql, [UserID], (err, results) => {
        // if there is an error say so
      if (err) return res.status(500).json({ error: 'Database error' });

      // show returned results if any
      console.log("Friends fetched for user", UserID, ": ", results)
      res.status(200).json({friends: results});
    });
  });
  
  app.post('/friends/add', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.body;
  
    if (userId === friendId) {
      return res.status(400).json({ error: "You can't add yourself as a friend" });
    }
  
    const sql = `
      INSERT IGNORE INTO shelf_friend (user_id, friend_id)
      VALUES (?, ?)
    `;
  
    db.query(sql, [userId, friendId], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Friend added successfully' });
    });
  });
  
  app.delete('/friends/remove', verifyToken, (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.body;
  
    const sql = `
      DELETE FROM shelf_friend
      WHERE user_id = ? AND friend_id = ?
    `;
  
    db.query(sql, [userId, friendId], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Friend removed successfully' });
    });
  });
  


// Add or update quantity of Food Item in Inventory and display updated Inventory
app.post('/addOrUpdateFood', verifyToken, (req, res) => {
    const { UserID } = req.user;
    const {FoodName, PurchaseDate, Quantity, Expiration, Storage, ExpirationStatus} = req.body;
    
    const foodQuery = `SELECT FoodItemID, DefaultShelfLife FROM food_item WHERE FoodName = ?`;

    db.query(foodQuery, [FoodName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving FoodItemID' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Food item not found in database' });
        }

        const {FoodItemID, DefaultShelfLife} = results[0];
        
        // declares a variable for the expiration date by using
        // the purchase date as a base
        let expirationDate = new Date(PurchaseDate);

        // adds the default shelf life of the item to the expiration date
        expirationDate.setDate(expirationDate.getDate() + DefaultShelfLife);

        // Makes the date into the YYYY-MM-DD format for MySQL
        let formattedExpiration = expirationDate.toISOString().split('T')[0];


        const query = `
        INSERT INTO inventory (UserID, FoodItemID, PurchaseDate, Quantity, Expiration, Storage, ExpirationStatus) VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE
            Quantity = Quantity + VALUES(Quantity),
            Expiration = VALUES(Expiration),
            Storage = VALUES(Storage),
            ExpirationStatus = VALUES(ExpirationStatus);`;

        db.query(query, [UserID, FoodItemID, PurchaseDate, Quantity, formattedExpiration, Storage, ExpirationStatus], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'An error occurred while adding or updating the food item.' });
            } else {
                res.status(200).json({ message: 'Food item added or updated successfully.' });
            }
        });
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

// update quantity of items consumed
app.post('/consumeFood', verifyToken, (req, res) => {
    const { FoodName, Quantity, Action } = req.body;
    const { UserID } = req.user;

    const foodQuery = `SELECT FoodItemID FROM food_item WHERE FoodName = ?`;

    db.query(foodQuery, [FoodName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving FoodItemID' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Food item not found in database' });
        }

    const { FoodItemID } = results[0];

    const query = `
            UPDATE inventory 
            SET Quantity = Quantity - ? 
            WHERE FoodItemID = ? AND UserID = ?;
        `;

        db.query(query, [Quantity, FoodItemID, UserID], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating food quantity' });
            }
            res.status(200).json({ message: 'Food quantity updated successfully' });
        });
    });
});

// Function to select the five highest wasted food items from the
// analytics table and sorts them from most to least wasted
app.get('/topWaste', verifyToken, async (req, res) => {
    const { UserID } = req.user;
    
    const sql = `SELECT analytics.Quantity, food_item.FoodName 
                 FROM analytics 
                 JOIN food_item ON analytics.FoodItemID = food_item.FoodItemID 
                 WHERE analytics.UserID = ? AND ExpirationStatus = 'expired'
                 ORDER BY analytics.Quantity DESC
                 LIMIT 5`;

    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query' });
        }
        
        res.status(200).json({ foodItems: results });
    });
});

// Select and send the number of expired food items and when they expired\
app.get('/expired', verifyToken, async (req, res) => {
    const { UserID } = req.user;

    const sql = `SELECT analytics.Quantity, analytics.DateExpired
        FROM analytics
        WHERE UserID = ? 
        AND ExpirationStatus = 'expired'`;

    db.query(sql, [UserID], (error, results) => {
        if(error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query'});
        }

        res.status(200).json({ expiredItems: results });
    });
});


// update the given status of an item to expired
app.post('/expireFood', verifyToken, (req, res) => {
    const { FoodName, Action } = req.body;
    const { UserID } = req.user;

    const foodQuery = `SELECT FoodItemID FROM food_item WHERE FoodName = ?`;

    db.query(foodQuery, [FoodName], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving FoodItemID' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Food item not found in database' });
        }

    const { FoodItemID } = results[0];

    const query = `
            UPDATE inventory 
            SET ExpirationStatus = 'expired' 
            WHERE FoodItemID = ? AND UserID = ?;
        `;

        db.query(query, [FoodItemID, UserID], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating food status' });
            }
            res.status(200).json({ message: 'Food status updated to expired' });
        });
    });
});


// selects the foods that a user can share
app.get('/sharing', verifyToken, async(req, res) => {
    const {UserID} = req.user;
    const sql = `SELECT inventory.inventoryID, food_item.FoodName, inventory.Quantity, inventory.ExpirationStatus 
                    FROM inventory
                    JOIN food_item ON inventory.FoodItemID = food_item.FoodItemID 
                    WHERE inventory.UserID = ?`;
    

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
             return res.status(500).json({message: 'Error getting inventory'});
            }
        res.status(200).json({foodItems: result})
    });
});

// returns the food that your friends set to share.
// query returns friends username, first name, last name, food item, the quantity of the food item
app.get('/friendsSharing', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    const sql = `SELECT user.userName, user.firstName, user.lastName, food_item.FoodName, shared_item.Status, shared_item.AvailableQuantity, food_item.DefaultUnit from shelf_friend
                join shared_item on shelf_friend.UserID_2 = shared_item.OwnerUserID
                join inventory on shared_item.InventoryItemID = inventory.InventoryID
                join food_item on inventory.FoodItemID = food_item.FoodItemID
                join user on shared_item.OwnerUserID = user.UserID
                where UserID_1 = ? and FriendStatus = "yes"`

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
            return res.status(500).json({message: 'Error getting friends foods'})
        }
    res.status(200).json({friendsSharing: result})
    })
});


// this is to get request for food
app.get('/friendsFoodRequests', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    // query returns the requsting users name and username, as well as the food item, quantity, and status of the food item
    const sql = `SELECT 
    user.userName,
    user.firstName,
    user.lastName,
    inventory.PurchaseDate,
    share_request.Status,
    food_item.FoodName,
    inventory.Quantity
FROM
    share_request
        JOIN
    shared_item ON share_request.SharedItemID = shared_item.SharedItemID
        JOIN
    user ON share_request.RequestorUserID = user.UserID
        JOIN
    inventory ON shared_item.InventoryItemID = inventory.InventoryID
        JOIN
    food_item ON inventory.FoodItemID = food_item.FoodItemID
WHERE
    shared_item.OwnerUserID = ?`;

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
            return res.status(500).json({message: 'Error getting friends foods'})
        }
    res.status(200).json({friendsFoodRequests: result})
    })
});

// this is to insert the food to share in the database
app.post('/Sharing/ShareFood', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    const sql = `INSERT INTO shared_item(InventoryItemID, OwnerUserID, AvailableQuantity, Status) VALUES(?, ?, ?, ?)`;
});

//*********************************************************** */
// // Handle WebSocket connections
// io.on('connection', (socket) => {
//     console.log('A user connected!');
  
//     // Listen for incoming messages
//     socket.on('sendMessage', (message) => {

//         console.log('Message received:', message);

//       // Broadcast the message to all connected clients
//         io.emit('receiveMessage', message);
//     });
  
//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('A user disconnected!');
//     });
//   });
  // Handle WebSocket connections here
io.on("connection", (socket) => {
    console.log("A new user has connected", socket.id);
  
    // Listen for incoming messages from clients
    socket.on("message", (message) => {
      // Broadcast the message to all connected clients
      io.emit("message", message);
    });
  
    // Handle disconnections
    socket.on("disconnect", () => {
      console.log(socket.id, " disconnected");
    });
  });
  
  server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  

//*********************************************************** */

// Server Setup
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});