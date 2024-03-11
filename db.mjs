import mongoose from 'mongoose';
//mongoose.connect(process.env.DSN,);

const routine = new mongoose.Schema({
    name: String,
    exercises: Array,
    goal: String
});

const Routine = mongoose.model('Routine', routine);

export {Routine};