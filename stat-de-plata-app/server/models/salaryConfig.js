module.exports = (sequelize, DataType) => {
    let model = sequelize.define('SalaryConfig', {

        name: {
            type: DataType.TEXT
        },
        id_outgoing: {
            type: DataType.INTEGER
        },
        normal: {
            type: DataType.BOOLEAN
        },
        total: {
            type: DataType.BOOLEAN
        },
        category: { 
            type: DataType.INTEGER
        }
    }, {
        timestamps: true
    });

    return model;
};
