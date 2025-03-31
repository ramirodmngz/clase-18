import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
    {
        name : {type: String, required: true},
        workspace: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace"},
        created_at : {type: Date, default: Date.now},
        created_by: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    }
)

const Channel = mongoose.model("Channel", channelSchema)

export default Channel 