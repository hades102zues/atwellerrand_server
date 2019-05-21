const { validationResult } = require("express-validator/check");


//mailgun api


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

    //generates the html elements for each item in the services list
    const servicesHtml = req.body.services.map((service:string):any => "<p>"+service+"</p>");

    //generate a single string that will be inserted into the template below to produce the service list
    const servicesHtmlOutput = servicesHtml.join(" ");

    //send the mail
    const mail:ReservationForm =  {
        from: `${req.body.name} <${req.body.email}>`,
        to: "jacob26referibles@gmail.com", //change to asda
        subject: 'Services Request',
        html: `
        <html>
        <body style="background-color: #fafafa; font-family:'Roboto'; font-size:16px; color:#0b1b20; ">
          <h1 style="text-align:center; color:#0b1b20;"> SERVICE REQUEST</h1>
          
          <p style="font-size:16px; color:#0b1b20;">${req.body.name}</p>
          <p style="font-size:16px; color:#0b1b20;">${req.body.email}</p>
          <p style="font-size:16px; color:#0b1b20;">${req.body.phone}</p>
          
          <div style="margin-top:10px; margin-left:40px;">
                <h3 style="color:#0b1b20;" >Services Requested:</h3>
       
                <div style="margin-left:20px">
                  ${servicesHtmlOutput}
                </div>
            
          </div>
          
          <div style="width:85%; margin-top:40px;">
            <h3 style="color:#0b1b20;">Additional Informaiton</h3>
          <p style="color:#0b1b20;">${req.body.message} </p>
          </div>
    
         </body>
       </html>
        `
    } ;

   mg.messages().send(mail).then(body => res.status(200).json({message: 'Email Sent'})).catch( err=> next(err) );
};
