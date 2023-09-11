module.exports = app => {
    'use strict';
    const express         = require('express');
    const salaryDataCtrl = require('../controllers/salaryDataCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', salaryDataCtrl.create);
    router.put('/', salaryDataCtrl.update);
    router.get('/', salaryDataCtrl.findAll);
    router.get('/:id', salaryDataCtrl.find);
    router.delete('/:id', salaryDataCtrl.destroy);
  
    return router;
  };
  