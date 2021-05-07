import Boom from '@hapi/boom';
import { asyncHandler } from '../middlewares/asyncHandler';
import User from '../models/User';

const getUserInfo = asyncHandler(async (req, res, next) => {
    const { login } = req.params;

    if (!login) {
        return next(Boom.badData('missing login'));
    }

    try {
        const user = await User.findOne({ login });

        if (!user) return next(Boom.badData('wrong user'));

        return res.status(200).json({
            login: user.login,
            name: user.name,
            lastName: user.name,
            ikon: user.ikon,
        });
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

export default {
    getUserInfo,
};
