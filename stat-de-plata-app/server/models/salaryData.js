module.exports = (sequelize, DataType) => {
    let model = sequelize.define('SalaryData', {

        id_salary: {
            type: DataType.TEXT
        },
        id_salary_config: {
            type: DataType.INTEGER
        },
        total: {
            type: DataType.BOOLEAN
        },
        clerk: {
            type: DataType.TEXT
        },
        contract: {
            type: DataType.TEXT
        },
        others: {
            type: DataType.TEXT
        }

    }, {
        timestamps: true
    });


    return model;
};
