import Boom from '@hapi/boom';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getPlaceNameByCoords } from '../helpers';

const getTitleByCoords = asyncHandler(async (req, res, next) => {
    const { coordinates } = req.body;

    if (!coordinates) return next(Boom.badData('missing coordinates'));

    try {
        const coords = await getPlaceNameByCoords(coordinates);

        return res.status(200).json(coords);
    } catch (err) {
        return next(Boom.badRequest(err.msg));
    }
});

export default {
    getTitleByCoords,
};
