import express from 'express';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import path from 'path';
import methodOverride from 'method-override';
import User from './backend/models/userModel';
import mainRouter from './backend/routers/mainRouter';

const app = express();
const port = process.env.PORT || 3000;
app.use(flash());
app.use(session({
    secret: "CHANGEME",
    resave: false,
    saveUninitialized: false 
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './frontend/views'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/static', express.static(path.join(__dirname, './frontend/static')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use('/', mainRouter);

app.listen(port, err => {
    if (err) 
        throw err;
    else 
        console.log(`Magic happens on port ${port}...`);
});