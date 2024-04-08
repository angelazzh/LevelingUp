import './config.mjs';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { User, Routine } from './db.mjs';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const user = await User.findOne();
        const currentTime = moment();
        let greeting = "Hello";

        if (currentTime.hour() < 12) {
            greeting = "Good Morning";
        } else if (currentTime.hour() < 18) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }
        res.render('home', {
            layout: 'main',
            name: user.username,
            greeting,
            date: currentTime.format('dddd, MMMM Do YYYY') 
        });
    }catch (error){
        console.error(error);
        res.status(500).send('Error fetching user');
    }
});

app.get('/routines', async (req, res) => {
    try {
      const routines = await Routine.find().lean();
      res.render('routines', { routines });
    }catch (error){
      console.error('Failed to fetch routines:', error);
      res.status(500).send('Error fetching routines');
    }
  });

app.get('/routines/create', (req, res) => {
    res.render('createRoutine');
}); 

app.get('/routines/:id', async (req, res) => {
    try {
      const routine = await Routine.findById(req.params.id).lean();
      if (!routine) {
        return res.status(404).send('Routine not found');
      }
      res.render('routineDetail', { routine });
    }catch (error){
      console.error(error);
      res.status(500).send('Error fetching routine details');
    }
}); 

app.post('/routines/create', async (req, res) => {
    const { routineName, exerciseName, sets, reps } = req.body;
  
    const exercises = exerciseName.map((name, index) => ({
      exerciseName: name,
      sets: Number(sets[index]), 
      reps: Number(reps[index]) 
    }));
  
    try {
      const newRoutine = new Routine({
        name: routineName,
        exercises 
      });
      
      await newRoutine.save();
      res.redirect('/routines');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
});  

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
});
