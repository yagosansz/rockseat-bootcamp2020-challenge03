import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    const { id: deliveryman_id } = req.params;
    return res.json({ message: `${deliveryman_id}` });
  }
}

export default new DeliveryController();
