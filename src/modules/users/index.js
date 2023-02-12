// const userRoutes = require('./userRoutes');
const UserDAL = require('./UserDAL');
const UserServices = require('./UserServices');
const User = require('./User');

const userDAL = new UserDAL(User);
const userServices = new UserServices(userDAL);

module.exports = {
  userDAL,
  userServices,
};
