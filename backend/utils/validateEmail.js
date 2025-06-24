const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const validateEmail = async (email) => {
    const apyhub_token = process.env.APYHUB_API_KEY;
    const options = {
        method: 'POST',
        url: 'https://api.apyhub.com/validate/email/academic',
        headers: {
            'Content-Type': 'application/json',
            'apy-token': apyhub_token,
        },
        data: {
            email
        }

    }
    try {
        const response = await axios(options);
        const data = response.data;
        if (data.domain && data.domain.endsWith('.edu')){
            return {isSchoolEmail: true, valid:true}
        }
        return {isSchoolEmail: false, valid: true};
    } catch (error) {
        console.log(error);
        return {isSchoolEmail: false, valid: false};
    }
}

module.exports = validateEmail;
