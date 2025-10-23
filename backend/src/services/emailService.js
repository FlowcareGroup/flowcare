import brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendEmail = async (to, templateObject) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.sender = { email: process.env.BREVO_FROM_EMAIL, name: process.env.BREVO_FROM_NAME };
  sendSmtpEmail.subject = templateObject.subject;
  sendSmtpEmail.htmlContent = templateObject.html;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email enviado a ${to}`);
  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error);
  }
};

export default sendEmail;
