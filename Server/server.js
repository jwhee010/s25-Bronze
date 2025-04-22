// Online, tutorials may refer to this file as index.js

const express = require('express');
const cors = require('cors');

const app = express();


//app.use(cors());
app.use(cors({
    origin: "http://localhost:5173", // Allow requests from your frontend URL
    methods: ["GET", "POST", "DELETE"], // Allowed HTTP methods
    credentials: true, // Include credentials like cookies or auth headers
}));

app.use(express.json())

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
    const { UserID } = req.user;
  
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
  
    db.query(sql, [UserID], (error, results) => {
      if (error) {
        console.error('Error executing query', error);
        return res.status(500).json({ message: 'Error fetching friends' });
      }
      
      res.status(200).json({friends: results});
    });
  });
  
  app.post('/friends/add', verifyToken, (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.UserID;
  
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }
  
    // Ensure that they do not add themselves
    if(userId == friendId){
        return res.status(400).json({ message: 'You cannot add yourself as a friend!' });
    }

    // Ensure duplicate friend entries aren't added
    const checkDuplicateSql = `SELECT * FROM shelf_friend WHERE (UserID_1 = ? AND UserID_2 = ?)`;
    
    db.query(checkDuplicateSql, [userId, friendId], (checkError, checkResult) => {
        if(checkError){
            return res.status(500).json({ message: 'Error checking existing friendship' });
        }

        if (checkResult.length > 0) {
            return res.status(400).json({ message: 'This user is already your friend!' });
        }
    

    // create variables to be inserted into the shelf_friend table
    const date = new Date();
    const friendStatus = 'yes';

    const sql = `INSERT INTO shelf_friend (UserID_1, UserID_2, DateConnected, FriendStatus) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`;
    
    // This values container could have been done for remove friend as well,
    // it's just that the remove friend did not need as many values
    const values = [userId, friendId, date, friendStatus, friendId, userId, date, friendStatus];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error('Error adding friend', error);
        return res.status(500).json({ message: 'Error adding friend' });
      }
      res.status(200).json({ message: 'Friend added successfully' });
    });
    });
  });
  
  app.post('/friends/remove', verifyToken, (req, res) => {
    const { UserID_2 } = req.body;
    const userId = req.user.UserID;
  
    console.log(`Remove Friend Request: user_id = ${userId}, friendId = ${UserID_2}`);
  
    if (!UserID_2) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }
  
    const sql = `DELETE FROM shelf_friend WHERE (UserID_1 = ? AND UserID_2 = ?) OR (UserID_1 = ? AND UserID_2 = ?)`;
    
    db.query(sql, [userId, UserID_2, UserID_2, userId], (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Error removing friend' });
      }
  
      if (result.affectedRows === 0) {
        console.warn('No rows deleted — check data match.');
        return res.status(404).json({ message: 'Friend not found or already removed' });
      }
  
      res.status(200).json({ message: 'Friend removed successfully' });
    });
  });
  

/// Add or update quantity of Food Item in Inventory and display updated Inventory
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
app.get('/Sharing', verifyToken, async(req, res) => {
    const {UserID} = req.user;
    const sql = `SELECT 
                        inventory.InventoryID,
                        food_item.FoodName,
                        inventory.Quantity,
                        inventory.ExpirationStatus
                 FROM
                        inventory
                            JOIN
                        food_item ON inventory.FoodItemID = food_item.FoodItemID
                 WHERE
                        inventory.UserID = ?
                        AND ExpirationStatus = 'fresh'`;
    

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
             return res.status(500).json({message: 'Error getting inventory'});
            }
        res.status(200).json({foodItems: result});
    });
});

// gets the food items that the user has set to share
app.get('/Sharing/yourShared', verifyToken, async(req, res) => {
    const {UserID} = req.user;
    const sql = `SELECT 
                    InventoryItemID
                 FROM
                    shared_item
                 WHERE
                    OwnerUserID = ?`;

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
            return res.status(500).json({message: 'Error getting your shared items'});
        }
        res.status(200).json({yourSharedItems: result});
    })
})

// this is to insert the food to share in the database
app.post('/Sharing/ShareFood', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    const {InventoryItemID, AvailableQuantity, Status} = req.body;
    const sql = `INSERT INTO shared_item(InventoryItemID, OwnerUserID, AvailableQuantity, Status) VALUES(?, ?, ?, ?)`;
    db.query(sql, [InventoryItemID, UserID, AvailableQuantity, Status], (error, result) => {
        if (error) {
            res.status(500).json({message: 'An error occured sending sharedFood information'});
        } else {
            res.status(200).json({message: 'your food has been shared'});
        }
    });
});

/* this function deletes a shared food Item from the shared_food table.
 So that no one can request that food item anymore*/
app.delete('/Sharing/UnShareFood', verifyToken, async(req,res) =>{
    const {InventoryItemID} = req.body;
    // check to make sure the item ID number is being passed
    console.log("Deleting InventoryItemID:", InventoryItemID);

    const sql = `DELETE FROM shared_item 
                WHERE
                InventoryItemID = ?`

    db.query(sql, [InventoryItemID], (error, result) => {
        if(error) {
            res.status(500).json({message: 'There was an issue deleting the food item'});
        } else {
            res.status(200).json({message: 'The food item has been unshared'})
        }
    })
});

// returns the food that your friends set to share.
// query returns friends username, first name, last name, food item, the quantity of the food item
app.get('/Sharing/Friends', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    const sql = `SELECT 
    user.userName,
    user.firstName,
    user.lastName,
    food_item.FoodName,
    shared_item.Status,
    shared_item.AvailableQuantity,
    food_item.DefaultUnit,
    shared_item.SharedItemID
FROM
    shelf_friend
        JOIN
    shared_item ON shelf_friend.UserID_2 = shared_item.OwnerUserID
        JOIN
    inventory ON shared_item.InventoryItemID = inventory.InventoryID
        JOIN
    food_item ON inventory.FoodItemID = food_item.FoodItemID
        JOIN
    user ON shared_item.OwnerUserID = user.UserID
WHERE
    UserID_1 = ? AND FriendStatus = 'yes'`

    db.query(sql, [UserID], (error, result) => {
        if(error) {
            console.log("error executing query")
            return res.status(500).json({message: 'Error getting friends foods'})
        }
    res.status(200).json({friendsSharing: result})
    })
});

/* query returns the food items that you have requested so it can be
   compared to the food items that other users have set to shareable 
   so that the buttons can be set in the correct states */
   app.get('/Sharing/getRequests', verifyToken, async(req, res) => {
    const {UserID} = req.user;
    const sql = `SELECT 
                    SharedItemID 
                FROM
                    share_request
                WHERE
                    RequestorUserID = ?`

    db.query(sql, [UserID], (error, result) => {
        if(error){
            return res.status(500).json({message: 'Error getting your requested food'})
        }
        res.status(200).json({userFoodRequests: result})
    })
   });

   // sends the data to the request_food table
   app.post('/Sharing/sendRequest', verifyToken, async(req,res) =>{
    const {UserID} = req.user;
    const {SharedItemID, Status} = req.body;

    const sql = `insert into share_request(RequestorUserID, SharedItemID, RequestDate, Status)
                 values(?, ?, current_date(), ?)`;

    db.query(sql, [UserID, SharedItemID, Status], (error, result) => {
        if (error) {
            res.status(500).json({message: 'An error occured sending sharedFood information'});
        } else {
            res.status(200).json({message: 'your food has been shared'});
        }
    });
   });

   // delete the food item request you wanted to request
   app.delete('/Sharing/unRequest', verifyToken, async(req, res) => {
    const {SharedItemID} = req.body;
    const {UserID} = req.user;

    const sql = `delete from share_request
                 where SharedItemID = ? and RequestorUserID = ?`;

    console.log("deleting request number", SharedItemID);
    db.query(sql, [SharedItemID, UserID], (error, result) => {
        if(error) {
            res.status(500).json({message: 'There was an issue deleting the food item request'});
        } else {
            res.status(200).json({message: 'The food item has been unrequestd'})
        }
    });
   });


// this is to get request for food
app.get('/friendsFoodRequests', verifyToken, async(req,res) => {
    const {UserID} = req.user;
    // query returns the requsting users name and username, as well as the food item, quantity, and status of the food item
    const sql = `SELECT 
	share_request.SharedItemID,
    share_request.RequestorUserID,
    user.userName,
    user.firstName,
    user.lastName,
    food_item.FoodName,
    food_item.FoodItemID,
    inventory.Quantity,
    inventory.InventoryID,
    inventory.ExpirationStatus,
    inventory.Expiration
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

app.post('/Sharing/AcceptRequest', verifyToken, (req, res) => {
    const { UserID } = req.user;
    const {
        RequestorUserID, SharedItemID, InventoryID,
        Quantity, FoodItemID, ExpirationStatus, Expiration
    } = req.body;

    console.log("👀 Incoming body:", req.body);
    console.log("🔐 Authenticated UserID:", UserID);

    const updateUser = `UPDATE inventory SET UserID = ? WHERE InventoryID = ?`;
    db.query(updateUser, [RequestorUserID, InventoryID], (err, result1) => {
        if (err) {
            console.error("🔥 Error updating inventory:", err);
            return res.status(500).json({ message: 'Error transferring ownership', error: err });
        }

        const deleteRequests = `DELETE FROM share_request WHERE SharedItemID = ?`;
        db.query(deleteRequests, [SharedItemID], (err, result2) => {
            if (err) {
                console.error("🔥 Error deleting request:", err);
                return res.status(500).json({ message: 'Error deleting food request', error: err });
            }

            const unshareItem = `DELETE FROM shared_item WHERE InventoryItemID = ?`;
            db.query(unshareItem, [InventoryID], (err, result3) => {
                if (err) {
                    console.error("🔥 Error unsharing item:", err);
                    return res.status(500).json({ message: 'Error unsharing item', error: err });
                }

                if (!UserID || !FoodItemID || !Quantity || !ExpirationStatus || !Expiration) {
                    console.error("❌ Missing data for analytics:", {
                        UserID, FoodItemID, Quantity, ExpirationStatus, Expiration
                    });
                    return res.status(400).json({ message: 'Missing required data for analytics' });
                }

                const updateAnalytics = `INSERT INTO analytics 
                    (UserID, FoodItemID, Quantity, ExpirationStatus, Status, DateExpired)
                    VALUES (?, ?, ?, ?, 'shared', ?)
                    ON DUPLICATE KEY UPDATE Quantity = Quantity + ?`;

                db.query(updateAnalytics,
                    [UserID, FoodItemID, Quantity, ExpirationStatus, Expiration, Quantity],
                    (err, result4) => {
                        if (err) {
                            console.error("🔥 Error updating analytics:", err);
                            return res.status(500).json({ message: 'Error updating analytics', error: err });
                        }

                        res.status(200).json({ message: 'Request accepted and analytics updated.' });
                    }
                );
            });
        });
    });
});

app.get('/Sharing/Analytics', verifyToken, (req, res) => {
    const { UserID } = req.user;

    const sql = `SELECT 
                        food_item.FoodName, analytics.Quantity
                    FROM
                        analytics
                    JOIN
                        food_item ON analytics.FoodItemID = food_item.FoodItemID
                    WHERE
                        analytics.UserID = ?
                    AND analytics.Status = 'shared'
                    ORDER BY analytics.Quantity DESC
                    LIMIT 5;`
    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query' });
        }

        res.status(200).json({ Analytics: results });
    });
});

app.get('/Sharing/AllAnalytics', verifyToken, (req, res) => {
    const { UserID } = req.user;

    const sql = `SELECT 
                        food_item.FoodName, analytics.Quantity
                    FROM
                        analytics
                    JOIN
                        food_item ON analytics.FoodItemID = food_item.FoodItemID
                    WHERE
                        analytics.UserID = ?
                    AND analytics.Status = 'shared'
                    ORDER BY analytics.Quantity DESC;`
    db.query(sql, [UserID], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error executing query' });
        }

        res.status(200).json({ Analytics: results });
    });
});

//*********************************************************** */

app.get('/messages', verifyToken, async (req, res) => {
    const { senderID, receiverID } = req.query; // Get query parameters from request
    const sql = `
        SELECT * FROM messages 
        WHERE (senderID = ? AND receiverID = ?) 
           OR (senderID = ? AND receiverID = ?)
        ORDER BY timestamp ASC
    `;

    db.query(sql, [senderID, receiverID, receiverID, senderID], (error, results) => {
        if (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ message: "Error retrieving messages." });
        } else {
            res.status(200).json(results); // Send the retrieved messages to the client
        }
    });
});

app.post('/messages', verifyToken, async (req, res) => {
    const { senderID, receiverID, text, timestamp } = req.body; // Extract message details from request body
    const sql = `
        INSERT INTO messages (senderID, receiverID, text, timestamp)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [senderID, receiverID, text, timestamp], (error, result) => {
        if (error) {
            console.error("Error saving message:", error);
            res.status(500).json({ message: "Error saving message." });
        } else {
            res.status(200).json({ message: "Message saved successfully." });
        }
    });
});

// Server Setup
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});