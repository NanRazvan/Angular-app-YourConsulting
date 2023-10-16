module.exports = db => {
    return {

      create: async (req, res) => {
        try {
          const createdSalary = await db.models.Salary.create(req.body);
          const elementsToCreate = [];
      
          for (const element of req.body.tableElements) {
              element.id_salary_config = element.id;
              element.id_salary = createdSalary.id;
              delete element.id;
              elementsToCreate.push(element);
          }

          for (const total of req.body.totals) {
              total.id_salary_config = total.id;
              total.id_salary = createdSalary.id;
              delete total.id;
              elementsToCreate.push(total);
          }
          
          await db.models.SalaryData.bulkCreate(elementsToCreate);
      
          res.send({ success: true });

        } catch (error) {
          console.error(error);
          res.status(500).send({ success: false, error: 'An error occurred while creating elements.' });
        }
      },
  
      update: async (req, res) => {
        const { id, tableElements, totals, invalidData } = req.body;
      
        try {
          
          await db.models.Salary.update(req.body, { where: { id } });
      
         
          const elementsToUpdate = [];
      
          for (const element of tableElements) {
            const { id: elementId, ...elementData } = element;
            elementsToUpdate.push({ ...elementData, id_salary: id, id_salary_config: elementId });
          }
      
          for (const total of totals) {
            const { id: totalId, ...totalData } = total;
            elementsToUpdate.push({ ...totalData, id_salary: id, id_salary_config: totalId });
          }
         
          for (const invalidElement of invalidData) {
            await db.models.SalaryData.destroy({
              where: {
                id_salary: id,
                id_salary_config: invalidElement.id,
              },
            });
          }

          for (const updateData of elementsToUpdate) {
            const existingElement = await db.models.SalaryData.findOne({
              where: {
                id_salary: id,
                id_salary_config: updateData.id_salary_config,
              },
            });
          
            if (existingElement) {
              
              await db.models.SalaryData.update(updateData, {
                where: {
                  id_salary: id,
                  id_salary_config: updateData.id_salary_config,
                },
              });
            } else {
              console.log(updateData);
              await db.models.SalaryData.create(updateData);
            }
          }
      
          res.send({ success: true });
        } catch (error) {
          console.error(error);
          res.status(500).send({ success: false, error: 'An error occurred while updating the salary and related data.' });
        }
      },
      
  
      findAll: (req, res) => {
        db.query(`SELECT *
        FROM "Salary"
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT id, month, name
        FROM "Salary"
        WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch(() => res.status(401));
      },

      findActivity: (req, res) => {
      
        db.query(`SELECT id
        FROM "Salary" 
        WHERE id_activity = ${req.params.id}`, { type: db.QueryTypes.SELECT })
        .then(resp => {
          
          if (resp) {
            res.send(resp);
          } else {
            res.status(404).send("No data found");
          }
        })
          .catch(() => res.status(401));
      },

      destroy: (req, res) => {
        db.models.Salary.destroy({
            where: { id: req.params.id },
        })
        .then(() => {
            res.send({ success: true });
        })
        .catch((error) => {
            console.error('Error deleting Salary:', error);
            res.status(500).send({ success: false, error: 'An error occurred while deleting Salary.' });
        });
    }
    };
  };
  