import Boom from '@hapi/boom';
import { asyncHandler } from '../middlewares/asyncHandler';
import Test from '../models/Test';
import User from '../models/User';

const createTest = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const { title, description, questions, type } = req.body;

    if (!title || !questions)
        return next(Boom.badData('missing title or questions'));
    if (!type) return next(Boom.badData('missing type'));
    if (user.accessCreateTests === false)
        return next(Boom.forbidden('you are not allowed to create test'));

    try {
        const newTest = new Test({
            type,
            author: user._id,
            title,
            description,
            questions,
        });
        await newTest.save();

        return res.status(200).json({
            testId: newTest._id,
            type: newTest.type,
            title: newTest.title,
            description: newTest.description,
            questions: newTest.questions,
        });
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const getTest = asyncHandler(async (req, res, next) => {
    const { testId } = req.params;

    if (!testId) return next(Boom.badData('missing testId'));

    try {
        const test = await Test.findById(testId);
        if (!test) return next(Boom.badData('wrong test'));

        return res.status(200).json({ test });
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

const getAllTests = asyncHandler(async (req, res, next) => {
    try {
        const tests = await Test.aggregate([
            {
                $project: {
                    testId: '$_id',
                    _id: 0,
                    title: 1,
                    description: 1,
                    author: 1,
                    type: 1,
                    questions: 1,
                },
            },
        ]);
        await User.populate(tests, { path: 'author', select: 'phone -_id' });

        return res.status(200).json({ tests });
    } catch (err) {
        return next(Boom.badRequest(err.message));
    }
});

export default {
    createTest,
    getAllTests,
    getTest,
};
