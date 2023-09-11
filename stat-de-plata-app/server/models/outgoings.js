module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Outgoings', {
      id_superior: {
        type: DataType.INTEGER
      },
      name: {
        type: DataType.TEXT
      },
      paragraph: {
        type: DataType.TEXT
      },
      last_child: {
        type: DataType.BOOLEAN
      }
    }, {
      timestamps: true
    });
  
    return model;
  };
  