module.exports = (sequelize, DataType) => {
    let model = sequelize.define('Salary', {

        month: {
            type: DataType.TEXT
        },
        name: {
            type: DataType.TEXT
        },
        id_activity: {
            type: DataType.INTEGER
        },
        obligation_date: {
            type: DataType.DATE
        },
        advances_date: {
            type: DataType.DATE
        },
        transfer: {
            type: DataType.TEXT
        },
        date: {
            type: DataType.DATE
        },
        cash_date: {
            type: DataType.DATE
        },
        contributions_date: {
            type: DataType.DATE
        },
    }, {
        timestamps: true
    });
    

return model;
};
