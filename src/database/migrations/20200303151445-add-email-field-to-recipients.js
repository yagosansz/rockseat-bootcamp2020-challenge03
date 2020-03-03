module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('recipients', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('recipients', 'email');
  },
};
