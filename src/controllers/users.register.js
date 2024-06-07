import { asyncHandler } from "../utils/assyncHandlers.js";
import { User } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { uploadOnCloudinary } from "../files.uploader/cloudinary.uploaders.js";

const register = asyncHandler(async (req, res) => {
    const { name, userName, email, password, securityQuestion, securityAnswer } = req.body;

    console.log(req.body);
    console.log('Name:', name);
    console.log('UserName:', userName);
    console.log('Email:', email);

    // All fields are required
    if (![name, userName, email, password, securityQuestion, securityAnswer].every(Boolean) || [name, userName, email, password, securityQuestion, securityAnswer].some(field => field.trim() === '')) {
        throw new APIError(404, 'All fields are required');
    }

    console.log(userName);

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [
            { userName },
            { email }
        ]
    });

    if (existedUser) {
        console.log(existedUser);
        throw new APIError(409, 'User already exists. Register with a new userName or Email');
    }

    const userPhoto = req.files && req.files.userPhoto ? req.files.userPhoto[0].path : null;
    console.log('UserPhoto:', userPhoto);

    let uploadedPhoto = { url: '' };
    if (userPhoto) {
        uploadedPhoto = await uploadOnCloudinary(userPhoto);
        if (!uploadedPhoto || !uploadedPhoto.url) {
            throw new APIError(400, 'Unable to upload the user photo');
        }
    }

    const user = await User.create({
        name: name.toLowerCase(),
        userName: userName.toLowerCase(),
        userPhoto: uploadedPhoto.url.toLowerCase(),
        email: email.toLowerCase(),
        password,
        securityKey: {
            securityQuestion,
            securityQuestionAnswer: securityAnswer
        }
    });

    // Created user
    const createdUser = await User.findById(user._id).select('-password -refreshToken -securityKey');
    if (!createdUser) {
        throw new APIError(502, 'Unable to create user');
    }

    res.status(200).json(new APIResponse(200, createdUser));
});

export { register };
