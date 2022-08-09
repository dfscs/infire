const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

// Welcome Template
const welcomefilePath = path.join(__dirname, "./Email-Template/Welcome.html");
const welcomeSource = fs.readFileSync(welcomefilePath, "utf-8").toString();
const welcomeTemp = handlebars.compile(welcomeSource);

//Forgot-password-template
const forgotFilePath = path.join(__dirname, "./Email-Template/forgotPswd.html");
const forgotSource = fs.readFileSync(forgotFilePath, "utf-8").toString();
const forgotTemp = handlebars.compile(forgotSource);

const client_origin = process.env.CLIENT_ORIGIN;

module.exports = {
  //confirm-email-template

  confirmEmailTemp: (id, name) => ({
    subject: `INFire WELCOME ${name}`,
    html: welcomeTemp({
      name,
      id,
      clientOrigin: client_origin,
    }),
  }),

  //Forgot-pswd-template
  forgotPswdTemp: (token, name) => ({
    subject: "INFire: Password Reset",
    html: forgotTemp({
      clientOrigin: client_origin,
      token,
    }),
    // attachments: [
    //   {
    //     filename: "image-4.png",
    //     path: `${__dirname}/emailTemplates/images/image-4.png`,
    //     cid: "image4",
    //   },
    // ],
  }),

  //pswd-change-template
  pswdChangeTemp: (name, email) => ({
    subject: "Your password has been changed",
    text:
      `Hello, ${name} \n\n` +
      `This is a confirmation that the password for your account ${email} \n` +
      " has just been changed.\n",
  }),

  //Email Feedback template
  feedbackTemplate: (name, email, description) => ({
    subject: "INFire FEEDBACK",
    html: `
      <h2>Feedback submitted by user ${name}</h2>
      <h2>Details</h2>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Description: ${description}</p>
    `,
  }),
};
