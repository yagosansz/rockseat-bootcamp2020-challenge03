import format from 'date-fns/format';

import Notification from '../schema/NotificationSchema';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class OrderController {
  async index(req, res) {
    // needs to edit findAll to display more data about recipient and deliveryman
    const orders = await Order.findAll({});

    if (!orders.length) {
      return res
        .status(400)
        .json({ error: 'No orders have been registered in the system yet' });
    }

    return res.json(orders);
  }

  async store(req, res) {
    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    const order = await Order.create(req.body);

    // Notify deliveryman that a new delivery has been assgined to him (replaice with nodemailer)
    const formattedDate = format(new Date(), "'at 'MMMM dd', 'h':'mm' 'aaaa");
    await Notification.create({
      content: `A new delivery has been assigned to you ${formattedDate} - Product: ${order.product}`,
      deliveryman: order.deliveryman_id,
    });

    return res.json(order);
  }

  async edit(req, res) {
    const { id } = req.params;
    const { recipient_id, deliveryman_id } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ error: 'Could not find order' });
    }

    if (recipient_id && recipient_id !== order.recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exist' });
      }
    }

    if (deliveryman_id && deliveryman_id !== order.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman does not exist' });
      }
    }

    const { product } = await order.update(req.body);

    return res.json({
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    if (!order) {
      res.status(404).json({ error: 'Could not find order' });
    }

    await order.destroy();

    return res.send();
  }
}

export default new OrderController();
