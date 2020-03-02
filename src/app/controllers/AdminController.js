import User from '../models/User';

class AdminController {
  async index(req, res) {
    const admins = await User.findAll({ where: { admin: true } });

    return res.json(admins);
  }
}

export default new AdminController();
