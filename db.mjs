import mongoose from 'mongoose';
//mongoose.connect(process.env.DSN,);

const ExerciseRoutine = new mongoose.Schema({
    exerciseName: String,
    sets: Number,
    reps: Number
});
const Exercise = new mongoose.model('Exercise', ExerciseSchema);

const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    exercises: [RoutineSchema]
});
const Routine = mongoose.model('Routine', RoutineSchema);

const GoalSchema = new mongoose.Schema({
    goal: {
        type: String,
        required: true
    },
    accomplishTime: {
        type: Date,
        default: Date.now
    }
});
const Goal = mongoose.model('Goal', GoalSchema);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    routines: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine",
        unique: [true, 'The routine name already exists']
    },
    goals: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
        unique: [true, 'The goal already exists']
    },
});
const User = mongoose.model('User', UserSchema);

export {Exercise, Routine, Goal, User};