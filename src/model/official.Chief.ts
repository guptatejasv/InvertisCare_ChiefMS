import { Schema, Document, model } from "mongoose";

export interface IChief extends Document {
  HODId: string;
  email: string;
  password: string;
  phone?: string;
  designation?: string;
  name?: string;
  dob?: Date;
  role: string;
  photo?: string;
  isDeleted?: boolean;
  isBlocked?: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const AuthSchema: Schema = new Schema(
  {
    ChiefId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "Chief",
    },
    phone: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    photo: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Chief = model<IChief>("Chief", AuthSchema);
