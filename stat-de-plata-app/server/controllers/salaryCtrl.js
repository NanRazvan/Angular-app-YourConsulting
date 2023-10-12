module.exports = db => {
    return {

      create: async (req, res) => {
        try {
          const createdSalary = await db.models.Salary.create(req.body);
          const elementsToCreate = [];
      
          for (const element of req.body.tableElements) {
            if ((element.clerk !== 0 || element.others !== 0 || element.contract !== 0) &&
                (element.clerk || element.others || element.contract)) {

              element.id_salary_config = element.id;
              element.id_salary = createdSalary.id;
              delete element.id;
              elementsToCreate.push(element);
            }
          }

          for (const total of req.body.totals) {
            if ((total.clerk !== 0 || total.others !== 0 || total.contract !== 0) &&
                (total.clerk || total.others || total.contract)) {

              total.id_salary_config = total.id;
              total.id_salary = createdSalary.id;
              delete total.id;
              elementsToCreate.push(total);
            }
          }
          

          console.log("elements to create",elementsToCreate);
          await db.models.SalaryData.bulkCreate(elementsToCreate);
      
          res.send({ success: true });

        } catch (error) {
          console.error(error);
          res.status(500).send({ success: false, error: 'An error occurred while creating elements.' });
        }
      },
  
      update: async (req, res) => {
        const { id, tableElements, totals } = req.body;
      
        try {
          
          await db.models.Salary.update(req.body, { where: { id } });
      
         
          const elementsToUpdate = [];
      
          for (const element of tableElements) {
            if (
              (element.clerk !== 0 || element.others !== 0 || element.contract !== 0) &&
              (element.clerk || element.others || element.contract)
            ) {
              const { id: elementId, ...elementData } = element;
              elementsToUpdate.push({ ...elementData, id_salary: id, id_salary_config: elementId });
            }
          }
      
          for (const total of totals) {
            if (
              (total.clerk !== 0 || total.others !== 0 || total.contract !== 0) &&
              (total.clerk || total.others || total.contract)
            ) {
              const { id: totalId, ...totalData } = total;
              elementsToUpdate.push({ ...totalData, id_salary: id, id_salary_config: totalId });
            }
          }
      
        
          for (const updateData of elementsToUpdate) {
            await db.models.SalaryData.update(updateData, {
              where: {
                id_salary: id,
                id_salary_config: updateData.id_salary_config,
              },
            });
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
  
      // destroy: (req, res) => {
      
      //   db.query(`
      //     DELETE FROM "SalaryData"
      //     WHERE "id_salary" IN (
      //       SELECT id FROM "Salary" WHERE id = ${req.params.id}
      //     );
          
      //     DELETE FROM "Salary" WHERE id = ${req.params.id};
      //   `, { type: db.QueryTypes.DELETE })
      //     .then(() => {
      //       res.send({ success: true });
      //     })
      //     .catch((error) => {
      //       console.error('Error deleting Salary and SalaryData:', error);
      //       res.status(500).send({ success: false, error: 'An error occurred while deleting Salary and SalaryData.' });
      //     });
      // }

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
  