const passport = require('passport');
const passportJwt = require('passport-jwt');
const knex = require('./db');

const { Strategy, ExtractJwt} = passportJwt;
const token = process.env.TOKEN;

module.exports = app => {
  const params = {
    secretOrKey: token,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  }

  const strategy = new Strategy(params, (payload, done) => {
    knex('users').where({id: payload.id}).first().then(user =>{

      if (user) {
        done(null, { id: user.id, email: user.email });
      } else {
        done(null, false);
      }

    }).catch(err => done(err, false));
  });

  passport.use(strategy);

  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false })
  }
}