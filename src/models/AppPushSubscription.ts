import { Schema, models, model, type Document, type Types } from "mongoose";

export interface IAppPushSubscription extends Document {
  userId: Types.ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AppPushSubscriptionSchema = new Schema<IAppPushSubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default models.AppPushSubscription ||
  model<IAppPushSubscription>("AppPushSubscription", AppPushSubscriptionSchema);
