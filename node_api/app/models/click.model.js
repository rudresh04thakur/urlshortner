module.exports = (sequelize, Sequelize) => {
    const CLICK = sequelize.define("click", {
      urlid: {
        type: Sequelize.INTEGER
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      countryName: {
        type: Sequelize.STRING
      }
    },{});
    CLICK.associate = function(models) {
        CLICK.belongsTo(models.URL, {foreignKey: 'urlid', as: 'urlid'})
      };
    return CLICK;
  };