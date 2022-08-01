const express = require('express');
const routes = require('./routes/v1')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { userService } = require('./services');

require('dotenv').config();


const app = express()
const port = process.env.PORT

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }
    const user = await userService.getUserById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use('/v1', routes);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


