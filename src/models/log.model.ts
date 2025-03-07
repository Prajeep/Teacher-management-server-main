import {Document, model, Schema} from "mongoose";

export interface ILog extends Document {
    _id: string;
    type: string;
    message: string;
    user: any;
    createdAt: any;
}

const LogSchema = new Schema<ILog>({
        message: {
            type: String,
        },
        type: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    });

export const Log = model<ILog>("Log", LogSchema);
