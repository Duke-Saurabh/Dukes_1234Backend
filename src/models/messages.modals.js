import mongoose from 'mongoose'; 
import { User } from './users.modals.js'; // Ensure this path is correct

// Define the message schema
const messageSchema = new mongoose.Schema({
    messFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    messTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    senderUserName:{
        type:String,
        required:true
    },
    recieverUserName:{
        type:String,
        required:true
    },
    messContent: {
        type: String,
        required: true // Message content is required
    },
    messType: {
        type: String,
        enum: ['video', 'audio', 'text'], // Only allow specific types
        default: 'text' // Default type is 'text'
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

// Export the Message model
export { Message };

