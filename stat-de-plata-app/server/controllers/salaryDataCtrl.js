module.exports = db => {
    return {
      create: (req, res) => {
        db.models.SalaryData.create(req.body).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.SalaryData.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
        db.query(`SELECT *
        FROM "SalaryData"
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT *
        FROM "SalaryData"
        WHERE id_salary = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      destroy: (req, res) => {
        db.query(`DELETE FROM "SalaryData" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      }
    };
  };
  