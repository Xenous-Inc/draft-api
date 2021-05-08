import Boom from '@hapi/boom';
import { asyncHandler } from '../middlewares/asyncHandler';
import User from '../models/User';

const getUserInfo = asyncHandler(async (req, res, next) => {
    const me = req.user;
    const { phone } = req.params;

    if (!phone) {
        return next(Boom.badData('missing phone'));
    }

    try {
        if (phone === 'me') {
            return res.status(200).json({
                phone: me.phone,
                ikon: me.ikon,
                username: me.username,
            });
        }
        const user = await User.findOne({ phone });

        if (!user) return next(Boom.badData('wrong user'));

        return res.status(200).json({
            ikon: user.ikon,
            username: user.ikon,
        });
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const changeUsername = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const { username } = req.body;

    try {
        user.username = username;
        await user.save();

        return res.status(200).json({});
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

export default {
    getUserInfo,
    changeUsername,
};
