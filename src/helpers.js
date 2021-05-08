import fetch from 'node-fetch';

const flash_token = process.env.FLASH_TOKEN;
const flash_id = process.env.FLASH_ID;

export const secureUserParams = (user) => {
    const {
        password,
        tokens,
        dislikes,
        likes,
        ...userFields
    } = user.toObject();
    return userFields
};

export const sendPhoneVerify = async (phone) => {
    const code = await fetch(
        `https://api.ucaller.ru/v1.0/initCall?service_id=${flash_id}&key=${flash_token}&phone=${phone.slice(
            1
        )}`
    )
        .then((response) => response.json())
        .then((data) => {
            return data.code;
        });

    return code;
};
