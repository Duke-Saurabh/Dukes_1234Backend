import { Message } from "../models/messages.modals.js";
import { User } from "../models/users.modals.js"; // Import User model
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";
import { asyncHandler } from "../utils/assyncHandlers.js";

// Function to create a new message
const createMessage = asyncHandler(async (req, res) => {
    console.log(req.body);
    // console.log('Request User:', req.user); // Log the request user

    const { messToUserName, messType, messContent } = req.body;

    if (!req.user || !req.user.userName) {
        throw new APIError(401, 'Authentication failed.');
    }

    // Find the recipient user
    const messToUser = await User.findOne({ userName: messToUserName });
    if (!messToUser) {
        throw new APIError(404, "Recipient user not found");
    }

    // Find the sender user
    const messFromUserName = req.user.userName;
    const messFromUser = await User.findOne({ userName: messFromUserName });
    if (!messFromUser) {
        throw new APIError(404, "Sender user not found");
    }

    // Create the message
    const messageCreate = await Message.create({
        messTo: messToUser._id, // Use the user's ObjectId
        messFrom: messFromUser._id, // Use the user's ObjectId
        senderUserName:messFromUser.userName,
        recieverUserName:messToUser.userName,
        messContent,
        messType
    });
     
    if(!messToUser.friends.includes(messFromUserName)){
    messToUser.friends.push( messFromUserName);
    await messToUser.save({ validateBeforeSave: false });
    }
    
    if(!messFromUser.friends.includes(messToUserName)){
    messFromUser.friends.push(messToUserName);
    await messFromUser.save({ validateBeforeSave: false });
    }
    
    // Send a response back to the client
    console.log(messageCreate);
    res.status(201).json(new APIResponse(201, messageCreate, "Message created successfully"));
});

export { createMessage };
