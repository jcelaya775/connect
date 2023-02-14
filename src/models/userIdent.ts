import mongoose, { Schema, SchemaTypes, models } from "mongoose";

export interface UserIdentity {
    service: string;
    user_id: string;
    access_token: string;
}

const IdentitySchema: Schema = new Schema<UserIdentity>({
    service: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
});