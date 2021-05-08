import fetch from 'node-fetch';

const yc_token = process.env.YC_IAM_TOKEN;

const mapbox_token = process.env.MAPBOX_TOKEN;

const flash_token = process.env.FLASH_TOKEN;
const flash_id = process.env.FLASH_ID;

const isCyrillic = (text) => {
    return /[а-я]/i.test(text);
};

export const translate = async (text) => {
    const translated = await fetch(
        'https://translate.api.cloud.yandex.net/translate/v2/translate',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${yc_token}`,
            },
            body: JSON.stringify({
                folder_id: 'b1g6pqpnlmcrin9o78km',
                texts: [text],
                targetLanguageCode: 'ru',
            }),
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data.translations[0].text;
        });

    return translated;
};

export const secureUserParams = (user) => {
    const {
        password,
        tokens,
        dislikes,
        likes,
        ...userFields
    } = user.toObject();
    return userFields;
};

export const getPlaceNameByCoords = async (coords) => {
    let country = '';
    let city = '';

    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[1]}%2C${coords[0]}.json?access_token=${mapbox_token}`
    )
        .then((response) => response.json())
        .then((data) => {
            return data.features[0].context;
        });

    const promise = new Promise((resolve, reject) => {
        response.forEach((context, index, array) => {
            if (context.id.includes('country')) {
                if (isCyrillic(context.text)) country = context.text;
                else
                    translate(context.text).then((text) => {
                        country = text;
                        if (index === array.length - 2) resolve();
                    });
            }
            if (context.id.includes('region')) {
                if (isCyrillic(context.text)) city = context.text;
                else
                    translate(context.text).then((text) => {
                        city = text;
                        if (index === array.length - 2) resolve();
                    });
            }
        });
    });

    return promise.then(() => {
        return {
            city,
            country,
        };
    });
};

export const getLocationName = (text) => {};

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
