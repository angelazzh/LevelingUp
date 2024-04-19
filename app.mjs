import './config.mjs';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { User, Routine, Goal } from './db.mjs';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(session({
  secret: 'f57099d51eb6889015782b0ea74aaa9b167ec0571c0958aa499ac603acf2b35e1b7af375cfdbff464841393a399ae0c2100074e6a20826612fff8e78d43114bc',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.post('/register', async (req, res) => {
  try {
      const { username, password } = req.body;
      const newUser = new User({ username });
      await User.register(newUser, password);
      req.login(newUser, (err) => {
          if (err) {
            console.error(err);
            return res.render('register', { error: 'Auto-login failed.' });
          }
          return res.redirect('/');
      });
  } catch (error) {
      if (error.name === 'UserExistsError') {
          return res.render('register', { error: 'Username already taken.' });
      }
      console.error(error);
      res.render('register', { error: 'Failed to create new user. Please try again.' });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { messages: { error: req.flash('error') } });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',         
  failureRedirect: '/login',   
  failureFlash: true
}));

app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error('Logout failed:', err);
          return res.status(500).send('Logout failed');
      }
      res.redirect('/');
  });
});

app.get('/', async (req, res) => {
  try {
      const user = req.user;
      let routines = [];
      let goals = [];
      if (user) {
          routines = await Routine.find({ user: user._id }).lean();
          goals = await Goal.find({ user: user._id }).lean();
      }
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
          user: user,
          name: req.user ? req.user.username : 'Guest',
          routines: routines,
          goals: goals,
          greeting: greeting,
          date: currentTime.format('dddd, MMMM Do YYYY')
      });
  } catch (error) {
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

app.get('/goals', async (req, res) => {
    try {
        const goals = await Goal.find().lean();
        res.render('goals', { goals });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching goals");
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

app.get('/goals/create', (req, res) => {
  res.render('createGoal');
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

app.post('/goals/create', async (req, res) => {
  try {
      const { description, targetDate } = req.body;
      const newGoal = new Goal({
          description,
          targetDate
      });
      await newGoal.save();
      res.redirect('/goals');
  } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).send('Failed to create goal');
  }
});

app.post('/goals/:id/toggle-complete', async (req, res) => {
  const goalId = req.params.id;
  try {
      const goal = await Goal.findById(goalId);
      if (!goal) {
          return res.status(404).send('Goal not found');
      }
      goal.completed = !goal.completed;
      await goal.save();
      res.redirect('/goals');
  } catch (error) {
      console.error(error);
      res.status(500).send('Failed to toggle the goal status');
  }
});

app.post('/goals/:id/delete', async (req, res) => {
  try {
      await Goal.findByIdAndDelete(req.params.id);
      res.redirect('/goals');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting goal');
  }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
});
