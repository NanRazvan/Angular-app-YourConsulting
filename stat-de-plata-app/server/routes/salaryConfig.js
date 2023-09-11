module.exports = app => {
    'use strict';
    const express         = require('express');
    const salaryConfigCtrl = require('../controllers/salaryConfigCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', salaryConfigCtrl.create);
    router.put('/', salaryConfigCtrl.update);
    router.get('/', salaryConfigCtrl.findAll);
    router.get('/:id', salaryConfigCtrl.find);
    router.delete('/:id', salaryConfigCtrl.destroy);
  
    return router;
  };
  