// Online, tutorials may refer to this file as index.js

const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json())

// This requirement will utilize a MySQL database 
// from the db.js of each individual team member, locally.
const db = require('./config/db')

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM user WHERE username = ? AND passwordHash = ?';
    const update = 'UPDATE user SET lastLogin = NOW() WHERE UserName = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'An error occurred while processing your request.' });
        } else {
            if (result.length > 0) {
                res.status(200).json({ message: 'Login successful' });
                db.query(update, [username]);
            } else {
                res.status(401).json({ message: 'Login failed. Invalid username or password.' });
            }
        }
    });
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})


// This code is from before the feb 20 change
/* 
app.get("/api/get", (req, res) => {
    db.query("SELECT * FROM user", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    });
});

app.post("/login", (req, res) => {
    const userName = req.body.userName;
    const passwordHash = req.body.passwordHash;

    db.query(
        "SELECT firstName, lastName FROM user Where userName = ? AND passwordHash = ?",
        [userName, passwordHash],
        (err, result) => {
            if(err) {
                res.send({err: err});
            }

            if(result.length > 0) {
                //res.send(result);
                res.send({
                    message: "Login successful! Welcome Mr/Mrs ",
                    firstName: result[0].firstName,
                    lastName: result[0].lastName
                }),
                db.query("UPDATE user SET lastLogin = NOW() WHERE UserName = ?", [userName]);
            }
            else {
                res.send({message: "Login failed. Please check your username and password and try again."})
            }
        }
    );
})
*/