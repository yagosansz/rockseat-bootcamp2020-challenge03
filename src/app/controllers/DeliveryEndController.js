import { isAfter, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryEndController {
  async update(req, res) {
    // /deliveryman/:deliveryman_id/end-delivery/:order_id
    const { deliveryman_id, order_id } = req.params;
    const { end_date } = req.body;

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

    if (!isAfter(parseISO(end_date), orderDeliverable.start_date)) {
      return res.status(400).json({
        error: 'Delivery end date needs to be after current date',
      });
    }

    await orderDeliverable.update({ end_date });

    return res.json(orderDeliverable);
  }
}

export default new DeliveryEndController();
