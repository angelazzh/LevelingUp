import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
mongoose.connect(process.env.DSN);

const ExerciseSchema = new mongoose.Schema({
    exerciseName: String,
    sets: Number,
    reps: Number,
});
const Exercise = new mongoose.model('Exercise', ExerciseSchema);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
});
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);


const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    exercises: [ExerciseSchema]
});
const Routine = mongoose.model('Routine', RoutineSchema);

const GoalSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
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

export {User};
export {Exercise};
export {Routine};
export {Goal};