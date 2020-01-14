const sgmail=require('@sendgrid/mail')

sgmail.setApiKey('SendGrid API Key')

const passwordResetEmail=(email, name, uniquecode)=>{
    sgmail.send({
        to: email,
        from: 'Ankur Gupta<gupta.ankur255@gmail.com>',
        subject: `Password Reset Code for ${name}'s Account`,
        text: `Your Unique Code to Reset your Account Password is ${uniquecode}`
    })
}

module.exports={
    passwordResetEmail
}