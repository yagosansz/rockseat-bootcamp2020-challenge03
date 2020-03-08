import {
  parseISO,
  isBefore,
  isAfter,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryStartController {
  async update(req, res) {
    const schema = Yup.object.shape({
      deliveryman_id: Yup.number().required(),
      order_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { deliveryman_id, order_id } = req.params;
    const { start_date } = req.body;

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

    const orderAvailable = await Order.findOne({
      where: {
        id: order_id,
        end_date: null,
        canceled_at: null,
        start_date: null,
      },
    });

    if (!orderAvailable) {
      return res
        .status(400)
        .json({ error: 'Order was canceled, delivered, or already picked up' });
    }

    if (!isAfter(parseISO(start_date), new Date())) {
      return res.status(400).json({
        error: 'Delivery start date needs to be after current date',
      });
    }

    const startHour = setSeconds(setMinutes(setHours(new Date(), '08'), 0), 0); // 08:00h of the current date
    const endHour = setSeconds(setMinutes(setHours(new Date(), '18'), 0), 0); // 18:00h of the current date

    // check if start_date is between 08:00 and 18:00h
    if (
      !(
        isAfter(parseISO(start_date), startHour) &&
        isBefore(parseISO(start_date), endHour)
      )
    ) {
      return res.status(400).json({
        error:
          'Start date should be between 08:00h and 18:00h of the current date',
      });
    }

    // check if deliveryman has no more than 5 deliveries for the choosen start date
    // You cannot pick up more than 5 orders in a single day
    const startedOrders = await Order.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startHour, endHour],
        },
      },
    });

    if (startedOrders.count >= 5) {
      return res.status(400).json({
        error: 'You have reached the number of pick ups (5) for the day',
      });
    }

    await orderAvailable.update({ start_date });

    return res.json(orderAvailable);
  }
}

export default new DeliveryStartController();
