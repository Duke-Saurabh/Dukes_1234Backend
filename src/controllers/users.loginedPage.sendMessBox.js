import { User } from "../models/users.modals.js";
import { APIResponse } from "../utils/APIResponse.js";
import { Message } from "../models/messages.modals.js";
import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/assyncHandlers.js";

const sendMessBox = asyncHandler(async (req, res) => {
    // Extract user information from request
    const { userName, email } = req.user;

    // Find the current user in the database
    const user = await User.findOne({ userName, email });

    // If user not found, throw a 404 error
    if (!user) {
        throw new APIError(404, "User not found");
    }

    // Extract the userName of the recipient user from the request parameters
    const { otherUserName } = req.params;

    // Ensure otherUserName exists
    if (!otherUserName) {
        throw new APIError(400, "Recipient username is required");
    }

    // Find the recipient user in the database
    const otherUser = await User.findOne({ userName: otherUserName });

    // If recipient user not found, throw a 404 error
    if (!otherUser) {
        throw new APIError(404, "Recipient user not found");
    }

    // Get the page number from parameters, default to 1
    const page = parseInt(req.params.page, 10);
   

    // Number of messages per page
    const limit = 20;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Aggregate messages based on sender and recipient
    const messages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { messFrom: user._id, messTo: otherUser._id },
                    { messFrom: otherUser._id, messTo: user._id }
                ]
            }
        },
        { $sort: { createdAt: -1 } }, // Sort messages by createdAt field in descending order
        { $skip: skip }, // Skip documents based on pagination
        { $limit: limit } // Limit the number of documents returned
    ]);
     
    console.log(page);
    console.log(messages);
    // Send JSON response with retrieved messages
    res.json(new APIResponse(200, messages));
});

export { sendMessBox };

