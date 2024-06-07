import { User } from "../models/users.modals.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/assyncHandlers.js";
// import bcrypt from 'bcrypt';

const changePassword = asyncHandler(async (req, res) => {
    const { userName, name, email, securityQuestion, securityAnswer, newPassword } = req.body;
   
    // All fields are required and must be non-empty
    if (![name, userName, email, securityQuestion, securityAnswer, newPassword].every(Boolean) || [name, userName, email, securityQuestion, securityAnswer, newPassword].some(field => field.trim() === '')) {
        throw new APIError(400, 'All fields are required');
    }
   
    // Check if user exists
    const user = await User.findOne({ userName, email });

    if (!user) {
        throw new APIError(404, 'User not found');
    }
    
    // console.log(req.body);
    // Verify user details
    if (user.name !== name || user.securityKey.securityQuestion !== securityQuestion || user.securityKey.securityQuestionAnswer !== securityAnswer) {
        console.log(user.securityKey.question);
        console.log(securityQuestion);
        throw new APIError(400, 'Incorrect credentials');
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    // user.password = hashedPassword;

    // Save the updated user details

    user.password=newPassword;
    await user.save();

    res.status(200).json(new APIResponse(200, 'User password has been changed'));
});

export { changePassword };
