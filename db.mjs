import mongoose from 'mongoose';
mongoose.connect(process.env.DSN,);

const ExerciseSchema = new mongoose.Schema({
    exerciseName: String,
    sets: Number,
    reps: Number,
});
const Exercise = new mongoose.model('Exercise', ExerciseSchema);

const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    exercises: [ExerciseSchema]
});
const Routine = mongoose.model('Routine', RoutineSchema);

const GoalSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    targetDate: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
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
    routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine",
    }],
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
    }],
});
const User = mongoose.model('User', UserSchema);

export {User};
export {Exercise};
export {Routine};
export {Goal};