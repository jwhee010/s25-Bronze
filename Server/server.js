const express = require('express');

// This requirement will utilize a MySQL database 
// from the db.js of each individual team member, locally.
const db = require('./config/db')


const cors = require('cors')

// changed port number to 80
const app = express();
const PORT = 80;
app.use(cors());
app.use(express.json())

// Route to get all posts
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
        "SELECT lastName FROM user Where userName = ? AND passwordHash = ?",
        [userName, passwordHash],
        (err, result) => {
            if(err) {
                res.send({err: err});
            }

            if(result.length > 0) {
                //res.send(result);
                res.send({
                    message: "Login successful! Welcome Mr/Mrs ",
                    lastName: result[0].lastName,
                })
            }
            else {
                res.send({message: "Login failed. Please check your username and password and try again."})
            }
        }
    );
})

/* Commenting everything else out for now

// Route to get one post
// changed id to UserID
app.get("/api/getFromId/:UserID", (req,res)=>{

// changed id to UserID
const UserID = req.params.UserID;
 db.query("SELECT * FROM user WHERE UserID = ?", UserID, 
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    console.log("HI!!!")
    console.log("The result is: **-" + result + "-**.")
    res.send(result)
    });   });

// Route for creating the post
app.post('/api/create', (req,res)=> {

const username = req.body.userName;
const passwordHash = req.body.passwordHash;
const email = req.body.email;

db.query("INSERT INTO posts (passwordHash, email, user_name) VALUES (?,?,?)",[passwordHash,email,username], (err,result)=>{
   if(err) {
   console.log(err)
   } 
   console.log(result)
});   })

// Route to like a post
app.post('/api/like/:UserID',(req,res)=>{

// changed id to UserID
const UserID = req.params.UserID;
db.query("UPDATE posts SET likes = likes + 1 WHERE UserID = ?",UserID, (err,result)=>{
    if(err) {
   console.log(err)   } 
   console.log(result)
    });    
});

// Route to delete a post
// changed id to UserID
app.delete('/api/delete/:UserID',(req,res)=>{
const id = req.params.UserID;

db.query("DELETE FROM posts WHERE UserID= ?", id, (err,result)=>{
if(err) {
console.log(err)
        } }) })

*/

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})