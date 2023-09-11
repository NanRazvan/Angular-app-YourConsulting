module.exports = app => {
  'use strict';
  const express         = require('express');
  const activityCtrl = require('../controllers/activityCtrl')(app.locals.db);
  const router          = express.Router();

  router.post('/', activityCtrl.create);
  router.put('/', activityCtrl.update);
  router.get('/', activityCtrl.findAll);
  router.get('/:id', activityCtrl.find);
  router.delete('/:id', activityCtrl.destroy);

  return router;
};
