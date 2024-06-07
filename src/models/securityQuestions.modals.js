import mongoose from "mongoose";

const securityQuestionSchema = new mongoose.Schema({
    securityQuestion: {
        type: String,
        enum: [
            'WHAT WAS YOUR CHILDHOOD NICKNAME?',
            'WHAT IS THE NAME OF YOUR FAVORITE CHILDHOOD FRIEND?',
            'NAME OF YOUR FIRST GIRL FRIEND',
            'WHAT IS YOUR FAVORITE TEAM?',
            'WHAT IS YOUR FAVORITE MOVIE?',
            'WHAT IS YOUR FAVOURITE SPORT?'
        ],
        required: true
    },
    securityQuestionAnswer: {
        type: String,
        required: true
    }
});

const SecurityQuestion = mongoose.model('SecurityQuestion', securityQuestionSchema);

export { securityQuestionSchema, SecurityQuestion };
