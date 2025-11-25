const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',


  auth: {
    user: 'jhonnyrojasflo@gmail.com',        // tu correo
    pass: 'audvtcsvctmomzad', // contraseña de aplicación
  },
});

transporter.verify((error, success) => {
  if (error) console.log(error);
  else console.log('Servidor listo para enviar correos con Gmail:', success);
});

/* const info = await transporter.sendMail({
  from: 'jhonnyrojasflo@gmail.com',
  to: 'jhonnyrojasflo@gmail.com',
  subject: 'Hello ✔',
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
}); */
module.exports = transporter;
