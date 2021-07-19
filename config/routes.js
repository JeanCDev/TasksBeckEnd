module.exports = app => {
  app.post('/signup', app.api.user.save);
  app.post('/signin', app.api.auth.signIn);

  app.route('/tasks')
    .all(app.config.passport.authenticate())
    .post(app.api.task.save)
    .get(app.api.task.getTasks);

  app.route('/tasks/:id')
    .all(app.config.passport.authenticate())
    .delete(app.api.task.remove)

  app.route("/taskToggle/:id")
    .all(app.config.passport.authenticate())
    .put(app.api.task.toggleTask);
}