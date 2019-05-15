

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//express api
const app = express();


//cors
app.use(cors({origin:true}));

//parser
app.use(bodyParser.json())

//routes
const mailRoutes = require('./routes/mail');


app.use(mailRoutes);


//error handler
app.use((error ,req, res, next)=>{
    res.status(501).json({error})
})

//Unknown Route Handler
app.use((req, res)=>{
    res.status(404).json({ message: 'Unknown Route'});
});


exports.cloudmail = functions.https.onRequest(app);
