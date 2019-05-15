import { resolve } from "path";

const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail');
const { body } = require("express-validator/check");


router.post('/send-contact-form', [

    body("name").isLength({min:1}),
    body("email").isEmail(),
    body("subject").isLength({min:1}),
    body("message").isLength({min:1}),

], mailController.postContactForm);


router.post('/send-request-form', [

        body("name").isLength({min:1}),
        body("email").isEmail(),
        body('phone').isLength({min:7}),
        body('services').custom((servicesArr, {req, res})=>{

            //no services have supplied
            if(servicesArr.length<1){
                    return res.status(400).json({message: 'Form Supplied Is Incomplete'})
            }
            else{
                return true;
            }
        }),

],mailController.postRequestForm );

module.exports = router;