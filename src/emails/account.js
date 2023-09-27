const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: email,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: email,
        subject: 'Sorry to see you go!',
        html: `<h4>Goodbye, ${name}! I hope to see you back sometime soon.</h4>`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}