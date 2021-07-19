const moment = require('moment');

const knex = require('../config/db');

module.exports = app => {
  const getTasks = (req, res) => {
    const date = req.query.date ? req.query.date : moment().endOf('day').toDate();

    knex('tasks')
      .where({ userId: req.user.id })
      .where('estimateAt', "<=", date)
      .orderBy('estimateAt')
      .then(tasks => res.json(tasks))
      .catch(err => res.status(500).json(err))
  }

  const save = (req, res) => {
    if (!req.body.desc.trim()) {
      return res.status(400).send('Descrição é um campo obrigatório');
    }

    req.body.userId = req.user.id;

    knex('tasks')
      .insert(req.body)
      .then(_ => res.status(200).send())
      .catch(err => res.status(500).send(err));
  }

  const remove = (req, res) => {
    knex('tasks')
      .where({id: req.params.id, userId: req.user.id})
      .delete()
      .then(rowsDeleted => {
        if (rowsDeleted > 0) return res.status(204).send();

        return res.status(404).send('Tarefa não encontrada');
      })
      .catch(err => res.status(500).json(err));
  }

  const updateTaskDoneAt = (req, res, doneAt) => {
    knex('tasks')
      .where({id: req.params.id, userId: req.user.id})
      .update({doneAt})
      .then(() => res.status(204).send())
      .catch(err => res.status(500).json(err));
  }

  const toggleTask = (req, res) => {
    knex('tasks')
      .where({id: req.params.id, userId: req.user.id})
      .first()
      .then(task => {
        if (!task) {
          return res.status(204).send(`Tarefa não encontrada`);
        }

        const doneAt = task.doneAt ? null : new Date();

        updateTaskDoneAt(req, res, doneAt);
      })
      .catch(err => res.status(500).json(err));
  }

  return {
    save, getTasks, remove, toggleTask
  }
}

