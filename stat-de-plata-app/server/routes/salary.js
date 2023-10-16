module.exports = app => {
    'use strict';
    const express         = require('express');
    const salaryCtrl = require('../controllers/salaryCtrl')(app.locals.db);
    const router          = express.Router();

    router.get('/findActivity/:id', salaryCtrl.findActivity);
  
    router.post('/', salaryCtrl.create);
    router.put('/', salaryCtrl.update);
    router.get('/', salaryCtrl.findAll);
    router.get('/:id', salaryCtrl.find);
    router.delete('/:id', salaryCtrl.destroy);
  
    return router;
  };
  