// /api/auth.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

// Simulate a user database (you'll replace this with your actual database logic)
const users = [{ username: 'test', password: bcryptjs.hashSync('password', 10) }];

// Passport configuration
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.find(u => u.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bcryptjs.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const user = users.find(u => u.username === username);
    done(null, user);
});

// Serverless function for login
module.exports = async (req, res) => {
    if (req.method === 'POST') {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: 'Authentication error' });
            }
            if (!user) {
                return res.status(401).json({ message: info.message });
            }
            res.status(200).json({ message: 'Logged in successfully', user });
        })(req, res);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
