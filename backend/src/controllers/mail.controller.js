
/* const transporter= require("../services/mail.service");

async function sendMail(req, res) {

  const { to } = req.body;
  const recipient = req.body;
  console.log(recipient);
  

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f5f5f5;">
      <h1 style="color: #4CAF50;">¡Hola desde Gmail!</h1>
      <p>Este correo está <b>estilizado</b> y enviado desde <i>Express.js</i>.</p>
      <a href="https://tusitio.com" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Visitar sitio</a>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Mi App" <tucorreo@gmail.com>',
      to,
      subject: 'Correo estilizado desde Gmail',
      html: htmlContent,
    });
   
    res.status(200).json({ message: 'Correo enviado', info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar correo', error: err });
  }



}



module.exports = { sendMail }; */