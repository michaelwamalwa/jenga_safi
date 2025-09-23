import mongoose, { Schema, Document, Types, Model } from "mongoose";

/* -------------------
   Interfaces (exported)
   ------------------- */
export interface CompletedTask {
  _id?: Types.ObjectId; // subdocs have an _id by default
  taskId: Types.ObjectId | Record<string, any>; // when populated it will be an object
  completedAt: Date;
  pointsEarned: number;
  carbonSaved: number;
  waterSaved: number;
}

export interface Streaks {
  current: number;
  longest: number;
  lastCompleted?: Date;
}

export interface MonthlyStats {
  ecoPoints: number;
  carbonSaved: number;
  waterSaved: number;
}

export interface UserStatsDoc extends Document {
  userId: Types.ObjectId | string;
  ecoPoints: number;
  carbonSaved: number;
  waterSaved: number;
  completedTasks: CompletedTask[];
  streaks: Streaks;
  monthlyStats?: MonthlyStats; // virtual
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------
   Subdocument schema
   ------------------- */
const CompletedTaskSchema = new Schema<CompletedTask>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "EcoTask" },
    completedAt: { type: Date, default: Date.now },
    pointsEarned: { type: Number, default: 0 },
    carbonSaved: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
  },
  { _id: true } // keep subdoc _id
);

/* -------------------
   Main schema
   ------------------- */
const UserStatsSchema = new Schema<UserStatsDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    ecoPoints: { type: Number, default: 0, min: 0 },
    carbonSaved: { type: Number, default: 0, min: 0 },
    waterSaved: { type: Number, default: 0, min: 0 },
    completedTasks: [CompletedTaskSchema],
    streaks: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastCompleted: Date,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true }, // include virtuals when calling .toObject()
    toJSON: { virtuals: true }, // include virtuals when calling .toJSON()
  }
);

/* -------------------
   Virtual: monthlyStats
   ------------------- */
UserStatsSchema.virtual("monthlyStats").get(function (this: UserStatsDoc) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTasks = (this.completedTasks || []).filter(
    (t) => t.completedAt && t.completedAt >= startOfMonth
  );

  return {
    ecoPoints: monthlyTasks.reduce((sum, t) => sum + (t.pointsEarned ?? 0), 0),
    carbonSaved: monthlyTasks.reduce((sum, t) => sum + (t.carbonSaved ?? 0), 0),
    waterSaved: monthlyTasks.reduce((sum, t) => sum + (t.waterSaved ?? 0), 0),
  } as MonthlyStats;
});

/* -------------------
   Model export (typed)
   ------------------- */
const UserStatsModel: Model<UserStatsDoc> =
  (mongoose.models.UserStats as Model<UserStatsDoc>) ||
  mongoose.model<UserStatsDoc>("UserStats", UserStatsSchema);

export default UserStatsModel;
