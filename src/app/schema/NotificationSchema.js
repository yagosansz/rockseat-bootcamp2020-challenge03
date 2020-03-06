import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    deliveryman: {
      type: Number,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
