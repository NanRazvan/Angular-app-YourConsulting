module.exports = app => {
    'use strict';
    const express         = require('express');
    const outgoingsCtrl = require('../controllers/outgoingsCtrl')(app.locals.db);
    const router          = express.Router();
  
    router.post('/', outgoingsCtrl.create);
    router.put('/', outgoingsCtrl.update);
    router.get('/', outgoingsCtrl.findAll);
    router.get('/:id', outgoingsCtrl.find);
    router.delete('/:id', outgoingsCtrl.destroy);
  
    return router;
  };
  