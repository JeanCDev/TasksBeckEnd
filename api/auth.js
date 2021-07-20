const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const knex = require('../config/db');

const token = process.env.TOKEN;

module.exports = app => {

  const signIn = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Dados incompletos');
    }

    const user = await knex('users')
      .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
      .first();

    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, match) => {

        if (err || !match) {
          return res.status(401).send('Email ou senha errados');
        }

        const payload = {id: user.id}

        res.status(200).send({name: user.name, email: user.email, token: jwt.sign(payload, token)});
      });
    } else {
      res.status(400).send('Usuário não cadastrado');
    }
  }

  return { signIn }

}
