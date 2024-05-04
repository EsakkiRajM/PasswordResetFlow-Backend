const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./db');
const { SignUpModel } = require('./Schema');
const dotenv = require('dotenv').config();

const app = express();
const PORT = dotenv.parsed.PORT;

app.use(bodyParser.json());
app.use(cors());

connectDB();

const jwt = require('jsonwebtoken');

const SECRET_KEY = 'My_Secret_key';

app.get("/", (req, res) => {
    res.send("Server working fine");
});

app.post("/registration", async (req, res) => {
    try {
        const data = await SignUpModel.create({
            username: req.body.username,
            password: req.body.password,
            phonenumber: req.body.phonenumber,
        });
        console.log(data, "data");
        res.send(data);
    } catch (error) {
        console.error("Error occurred while registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/findUserName", async (req, res) => {
    try {
        const username = req.query.username;
        const user = await SignUpModel.findOne({ username: username });

        if (user) {
            console.log(user.username); // Print username if found
            res.status(200).json({ username: user.username, _id: user._id }); // Send username as JSON response
        } else {
            console.log("User not found");
            res.status(404).json({ error: "User not found" }); // Respond with error if user not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" }); // Handle internal server error
    }
});

// app.get("/checkUserName", async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
  
//     if (!token) {
//         return res.status(401).json({ error: 'Unauthorized: Missing token' });
//     }

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         const { username } = decoded;

//         const user = await SignUpModel.findOne({ username });

//         if (user) {
//             return res.status(200).json({ exists: true });
//         } else {
//             return res.status(404).json({ exists: false });
//         }
//     } catch (error) {
//         console.error('Error occurred while verifying token:', error);
//         return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }
// });

app.listen(PORT, () => {
    console.log("Server Started");
});
