import { Op } from 'sequelize';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Order';

class DeliveryEndController {
  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      order_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { deliveryman_id, order_id } = req.query;

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(404).json({ error: 'Could not find deliveryman' });
    }

    const orderExists = await Order.findByPk(order_id);

    if (!orderExists) {
      return res.status(404).json({ error: 'Could not find order' });
    }

    // Check if order was assigned to the deliveryman
    const assignedOrder = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
      },
    });

    if (!assignedOrder) {
      return res
        .status(400)
        .json({ error: 'Order was assigned to other deliveryman' });
    }

    const orderDeliverable = await Order.findOne({
      where: {
        id: order_id,
        end_date: null,
        canceled_at: null,
        start_date: {
          [Op.not]: null,
        },
      },
    });

    if (!orderDeliverable) {
      return res.status(400).json({
        error: 'Order was canceled, already delivered, or not picked up yet',
      });
    }

    if (!req.file) {
      return res.status(401).json({ error: 'Recipient signature not found' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const signature_id = file.id;
    const end_date = new Date();

    await orderDeliverable.update({ end_date, signature_id });

    return res.json(orderDeliverable);
  }
}

export default new DeliveryEndController();
