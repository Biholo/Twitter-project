import mongoose from "mongoose";

export interface IResetPassword extends Document {
    token: string;
    user: mongoose.Types.ObjectId;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}

const resetPasswordSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expires_at: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

resetPasswordSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

export default  mongoose.model<IResetPassword>("ResetPassword", resetPasswordSchema);


