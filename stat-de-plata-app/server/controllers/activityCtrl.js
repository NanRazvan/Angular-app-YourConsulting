module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Activity.create(req.body).then(() => {
          res.send({ success: true });
        }).catch(() => res.status(401));
      },
  
      update: (req, res) => {
        db.models.Activity.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      findAll: (req, res) => {
        db.query(`SELECT *
        FROM "Activity"
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT id, id_superior ,name, code, last_child
        FROM "Activity"
        WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch(() => res.status(401));
      },

      findNotLastChild: (req, res) => {
        db.query(`SELECT id
        FROM "Activity"
        WHERE last_child = false`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      destroy: (req, res) => {
        const activityIdToDelete = req.params.id;
      
        
        db.query(`
          SELECT 1
          FROM "Salary"
          WHERE "id_activity" = ${activityIdToDelete}
          LIMIT 1
        `, { type: db.QueryTypes.SELECT })
          .then((result) => {
            if (result && result.length > 0) {
              
              res.status(400).send({ success: false, error: 'Activitate prezenta intr un stat de palta' });
            } else {
              
              db.query(`DELETE FROM "Activity" WHERE id = ${activityIdToDelete}`, { type: db.QueryTypes.DELETE })
                .then(() => {
                  res.send({ success: true });
                })
                .catch(() => res.status(401));
            }
          })
          .catch(() => res.status(401));
      }
      
    };
  };
  