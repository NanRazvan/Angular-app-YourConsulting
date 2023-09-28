module.exports = app => {
  'use strict';
  const express      = require("express");
  const appPath      = __dirname + '/../client';
  const path         = require('path');
  const errors       = require('./errors');

  /* LOGIN */
  app.use('/api/outgoings', require('./routes/outgoings')(app));
  app.use('/api/activity', require('./routes/activity')(app));
  app.use('/api/salary', require('./routes/salary')(app));
  app.use('/api/salaryConfig', require('./routes/salaryConfig')(app));
  app.use('/api/salaryData', require('./routes/salaryData')(app));


  app.route('*/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

  /* BUILD */
  app.use(express.static(path.join(appPath, 'dist/client')));
  app.get('/*', (req, res) => res.sendFile(path.join(appPath, 'dist/client', 'index.html')));

  app.route('*').get(errors[404]);
};
