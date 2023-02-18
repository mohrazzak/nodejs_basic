// const userRoutes = require('./userRoutes');
const UserDAL = require('./user.dal');
const UserServices = require('./user.service');
const User = require('./user.model');

const userDAL = new UserDAL(User);
const userServices = new UserServices(userDAL);

module.exports = {
  userDAL,
  userServices,
};
