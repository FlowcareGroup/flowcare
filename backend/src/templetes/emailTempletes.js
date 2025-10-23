
  const templateNewAppointment = (doctorName, patientName, date, time) => {
  return {
    subject: "Nueva cita reservada",
    html: `
      <html>
        <head>
          <style>
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #33ade6; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fff; }
            .footer { padding: 10px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666; }
            .btn { background-color: #33ade6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Flowcare</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${doctorName}</strong>,</p>
              <p>El paciente <strong>${patientName}</strong> ha reservado una cita contigo.</p>
              <p><strong>Detalles de la cita:</strong></p>
              <ul>
                <li><strong>Fecha:</strong> ${date}</li>
                <li><strong>Hora:</strong> ${time}</li>
                <li><strong>Paciente:</strong> ${patientName}</li>
              </ul>
              <p>Por favor confirma la cita en el dashboard de Flowcare.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Flowcare. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

const templateCancelledAppointment = (doctorName, patientName, date, time) => {
  return {
    subject: "Cita cancelada",
    html: `
      <html>
        <head>
          <style>
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #33ade6; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fff; }
            .footer { padding: 10px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666; }
            .btn { background-color: #33ade6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Flowcare</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${doctorName}</strong>,</p>
              <p>El paciente <strong>${patientName}</strong> ha cancelado su cita contigo.</p>
              <p><strong>Detalles de la cita cancelada:</strong></p>
              <ul>
                <li><strong>Fecha:</strong> ${date}</li>
                <li><strong>Hora:</strong> ${time}</li>
                <li><strong>Paciente:</strong> ${patientName}</li>
              </ul>
              <p>Por favor verifica el estado de la cita en el dashboard de Flowcare.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Flowcare. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

const templateRescheduledAppointment = (doctorName, patientName, date, time) => {
  return {
    subject: "Cita reprogramada",
    html: `
      <html>
        <head>
          <style>
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #33ade6; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #fff; }
            .footer { padding: 10px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #666; }
            .btn { background-color: #33ade6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Flowcare</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${doctorName}</strong>,</p>
              <p>El paciente <strong>${patientName}</strong> ha reprogramado su cita contigo.</p>
              <p><strong>Detalles de la cita reprogramada:</strong></p>
              <ul>
                <li><strong>Fecha:</strong> ${date}</li>
                <li><strong>Hora:</strong> ${time}</li>
                <li><strong>Paciente:</strong> ${patientName}</li>
              </ul>
              <p>Por favor confirma la cita en el dashboard de Flowcare.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Flowcare. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };
};

export { templateNewAppointment, templateCancelledAppointment, templateRescheduledAppointment };