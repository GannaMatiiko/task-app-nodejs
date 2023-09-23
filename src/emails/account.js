const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);
sgMail.send({
    to: 'gannamatiyko@gmail.com',
    from: 'gannamatiyko@gmail.com',
    subject: 'This is my first creation!',
    text: 'I hope you will get this text'
})