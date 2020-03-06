import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveriesController {
  async index(req, res) {
    const { id: deliveryman_id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(404).json({ error: 'Could not find deliveryman' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: {
          [Op.not]: null,
        },
        canceled_at: {
          [Op.is]: null,
        },
      },
    });

    if (!orders.length) {
      return res
        .status(200)
        .json({ message: 'You have not delivered any orders yet' });
    }

    return res.json(orders);
  }
}

export default new DeliveriesController();
