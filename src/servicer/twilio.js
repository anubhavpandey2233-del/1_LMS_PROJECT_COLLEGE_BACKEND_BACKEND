const sendSMS = async (phone_no, OTP) => {
    try {
        if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
            throw new Error("Twilio is not configured. Set TWILIO_SID and TWILIO_TOKEN.");
        }

        const client = require('twilio')(
            process.env.TWILIO_SID,
            process.env.TWILIO_TOKEN
        );

        const message = await client.messages.create({
            body: `Your OTP is: ${OTP}`,
            messagingServiceSid: 'MG3b2a5294453a7a6222bb9444eaaff896',
            to: phone_no
        });

        console.log(message.sid);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = sendSMS;
