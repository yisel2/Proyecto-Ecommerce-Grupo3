const Category = (sequalize, S) =>{

    const C = sequelize.define('category', {
        id: {
            type: S.INTEGER,
            allowNull: false,
            autoIncrement: true,
          },
        name: {
            type: S.STRING,
            allowNull: false,
            validate: {noEmpty: true}
        },
    }),

return C;
}

module.exports = Category;