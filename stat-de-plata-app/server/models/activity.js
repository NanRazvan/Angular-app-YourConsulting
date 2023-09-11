module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Activity', {
      name: {
        type: DataType.TEXT
      },
      code: {
        type: DataType.TEXT
      },
      last_child: {
        type: DataType.BOOLEAN
      }
    }, {
      timestamps: true
    });
  ;
    return model;
  };
  