import Boom from '@hapi/boom';
import validator from 'validator';
import { asyncHandler } from '../middlewares/asyncHandler';
import User from '../models/User';
import { sendPhoneVerify } from '../helpers';

const auth = asyncHandler(async (req, res, next) => {
    const { phone, code } = req.body;

    if (!phone || !validator.isMobilePhone(phone, 'ru-RU', {strictMode: true})) {
        return next(Boom.badData('missing or wrong phone'));
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            const newCode = await sendPhoneVerify(phone);
            const newUser = new User({ lastConfirmPass: newCode, phone });
            await newUser.save();
            return next(Boom.locked('verification code sent'));
        }

        if (user && user.isRegistered && !code) {
            const newCode = await sendPhoneVerify(phone);
            user.lastConfirmPass = newCode;
            await user.save();
            return next(Boom.locked('verification code sent'));
        }

        if (user && user.isRegistered && code) {
            if (user.lastConfirmPass === code) {
                user.lastConfirmPass = '0000';
                await user.save();
                const token = await user.generateAuthToken();
                return res.status(200).json({ token });
            }
            return next(Boom.badData('wrong code'));
        }

        if (user && !user.isRegistered && code) {
            if (user.lastConfirmPass === code) {
                user.isRegistered = true;
                user.lastConfirmPass = '0000';
                await user.save();
                const token = await user.generateAuthToken();
                return res.status(200).json({ token });
            }
            return next(Boom.badData('wrong code'));
        }

        if (user && !user.isRegistered && !code) {
            const newCode = await sendPhoneVerify(phone);
            user.lastConfirmPass = newCode;
            await user.save();
            return next(Boom.locked('verification code sent'));
        }
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const logout = asyncHandler(async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();
        return res.status(200).json({});
    } catch (error) {
        return next(Boom.internal(error));
    }
});

const logoutAll = asyncHandler(async (req, res, next) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        return res.status(200).json({});
    } catch (error) {
        return next(Boom.internal(error));
    }
});

export default {
    auth,
    logout,
    logoutAll,
};
