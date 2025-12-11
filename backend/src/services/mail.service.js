const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jhonnyrojasflo@gmail.com',     
    pass: 'audvtcsvctmomzad', 
  },
});

// Solo verificar conexión cuando NO estamos en tests
if (process.env.NODE_ENV !== 'test') {
  transporter.verify((error, success) => {
    if (error) console.log(error);
    else console.log('Servidor listo para enviar correos con Gmail:', success);
  });
}

async function sendMail(persona, roles) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f5f5f5;">
      <h1 style="color: #4CAF50;">¡Hola ${persona.nombres} ${persona.apellidos}!</h1>
      <p>Se te han asignado los siguientes roles: <b>${roles.join(', ')}</b>.</p>
      <a href="https://tusitio.com" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Visitar sitio</a>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Mi App" <jhonnyrojasflo@gmail.com>',
      to: persona.correo,
      subject: 'Nuevos roles asignados',
      html: htmlContent,
    });

    return info;
  } catch (err) {
    console.error('Error al enviar correo:', err);
    throw err;
  }
}
module.exports = {  
  sendMail,
};
