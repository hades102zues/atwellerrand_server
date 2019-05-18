const { validationResult } = require("express-validator/check");


//mailgun api
const mailgun = require('mailgun-js');
const DOMAIN = "";
const mg = mailgun({
  apiKey: "",
  domain: DOMAIN
});


interface ContactForm {
    
    from: string,
    subject:string,
    to:string,
    text:string,
    
    html?:string
}

interface ReservationForm {
   
    from: string,
    to:string,
    subject:string,
    html:string
    

    text?:string
    
}

exports.postContactForm  = (req, res, next) => {
 
     //perform checks for valid form information
     if (!validationResult(req).isEmpty()) {
        return res.status(400).json({message: 'Form Supplied Is Incomplete'})
    }

        const mail:ContactForm = {
            from: `${req.body.name} <${req.body.email}>`,
            to: "jacob26referibles@gmail.com",
            subject: req.body.subject,
            text: req.body.message
        }
      //send the mail
      mg.messages().send(mail).then(body => res.status(200).json({message: 'Email Sent'})).catch( err=> next(err) );
      
};

exports.postRequestForm = (req, res, next) =>{

    //perform checks for valid form information
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({message: 'Form Supplied Is Incomplete'})
    }

    //send the mail
    const mail:ReservationForm =  {
        from: `${req.body.name} <${req.body.email}>`,
        to: "jacob26referibles@gmail.com",
        subject: 'Services Request',
        html: `
        <html>
         <body style="background-color:">
            <p style="font-size:18px; color:#333; font-weight:bold;">Phone Number: <span style="font-size:18px; color:#333; font-weight:100">${req.body.phone}</span></p>
            <p style="font-size:18px; color:#333; font-weight:bold; margin-top:25px">Service Requested: <span style="font-size:18px; color:#333; font-weight:100">${req.body.services}</span> </p>
       
            
            <p style="font-size:18px; color:#333; font-weight:bold; margin-top:35px"> Additional Message</p>
            <p style="font-size:16px; color:#333; margin-top:5px">${req.body.message}</p>
         </body>
        </html>
        `
    } ;

    mg.messages().send(mail).then(body => res.status(200).json({message: 'Email Sent'})).catch( err=> next(err) );
};
