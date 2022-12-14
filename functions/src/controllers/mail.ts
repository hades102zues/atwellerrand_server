const { validationResult } = require("express-validator/check");

const firebase_functions = require("firebase-functions");
const firebase_ENV = firebase_functions.config().env;

//mailgun api
const mailgun = require("mailgun-js");
const DOMAIN: string = firebase_ENV.mail_domain;
const APIKEY: string = firebase_ENV.api_key;

const email: string = firebase_ENV.email; //email that the mail will be delivered to
const from: string = firebase_ENV.from; //the domain that we'll be sending the emails from ;
const name: string = firebase_ENV.name; //the name that will appear in the from line

const mg = mailgun({
  apiKey: APIKEY,
  domain: DOMAIN,
});

interface ContactForm {
  from: string;
  subject: string;
  to: string;
  text: string;

  html?: string;
}

interface ReservationForm {
  from: string;
  to: string;
  subject: string;
  html: string;

  text?: string;
}

exports.postContactForm = (req, res, next) => {
  //perform checks for valid form information
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: "Form Supplied Is Incomplete" });
  }

  const mail: ReservationForm = {
    from: `${name} <${from.trim()}>`,
    to: email,
    subject: req.body.subject,
    html: `
            <html>
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="background-color: #fafafa; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0b1b20; padding:20px 20px;">
              <h2 style="text-align:center; color:#333;">Customer Inquiry</h1>
              
              <p style="font-size:16px; color:#0b1b20;">${req.body.name}</p>
              <p style="font-size:16px; color:#0b1b20;">${req.body.email}</p>

              <div style="width:90%; margin-top:40px;margin-left:0px">
                <p style="color:#0b1b20;font-size:16px;text-align:left">${req.body.message} </p>
              </div>
        
             </body>
           </html>
            `,
  };
  //send the mail
  mg.messages()
    .send(mail, (err, body) => {
      if (!err) {
        res.status(200).json({ message: "Email Sent" });
      } else {
        res.status(500).json({ message: "Email was not sent", err });
      }
    })
    .catch((err) => next(err));
};

exports.postRequestForm = (req, res, next) => {
  //perform checks for valid form information
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: "Form Supplied Is Incomplete" });
  }

  //generates the html elements for each item in the services list
  const servicesHtml = req.body.services.map(
    (service: string): any => "<p>" + service + "</p>"
  );

  //generate a single string that will be inserted into the template below to produce the service list
  const servicesHtmlOutput = servicesHtml.join(" ");

  //send the mail
  const mail: ReservationForm = {
    from: `${name} <${from.trim()}>`,
    to: email,
    subject: "Services Request",
    html: `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="background-color: #fafafa; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0b1b20; padding:20px 20px;">
          <h2 style="text-align:center; color:#333;"> SERVICE REQUEST</h1>
          
          <p style="font-size:16px; color:#0b1b20;">${req.body.name}</p>
          <p style="font-size:16px; color:#0b1b20;">${req.body.email}</p>
          <p style="font-size:16px; color:#0b1b20;">${req.body.phone}</p>
         
          <h3 style="color:#0b1b20;" >Services Requested:</h3>
       
                <div style="margin-left:20px">
                  ${servicesHtmlOutput}
                </div>

          
          <div style="width:90%; margin-top:40px;">
            <h3 style="color:#0b1b20;">Additional Information</h3>
          <p style="color:#0b1b20;">${req.body.message} </p>
          </div>
    
         </body>
       </html>
        `,
  };

  mg.messages()
    .send(mail, (err, body) => {
      if (!err) {
        res.status(200).json({ message: "Email Sent" });
      } else {
        res.status(500).json({
          message: "Email was not sent",
          err,
        });
      }
    })
    .catch((err) => next(err));
};
