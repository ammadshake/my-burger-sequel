module.exports = function(sequelize, DataTypes) {
 
  var Customer = sequelize.define("Customer", 
    {
    
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      classMethods: {
       
        associate: function(models) {
          Customer.hasMany(models.Burger)
        }
      }
    });

  return Customer;
};
