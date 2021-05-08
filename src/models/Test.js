import mongoose from 'mongoose';

const { Schema } = mongoose;

const testSchema = new Schema({
    type: {
        type: String,
        enum: ['country', 'oil', 'city'],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questions: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
                maxLength: 1500,
            },
            answers: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                    location: {
                        type: {
                            type: String,
                            enum: ['Point'],
                            required: true,
                        },
                        coordinates: {
                            type: [Schema.Types.Number],
                            required: true,
                        },
                    },
                },
            ],
        },
    ],
});

const Test = mongoose.model('Test', testSchema);

export default Test;
