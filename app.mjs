import express from 'express';
import { engine } from 'express-handlebars';
import './config.mjs';
//import './db.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './db.mjs';


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const user = await User.findOne(); 
        res.render('home', {
            layout: 'main', 
            name: user.username, 
            date: new Date().toDateString()
        });
    }catch (error){
        console.error(error);
        res.status(500).send('Error fetching user');
    }
});


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
