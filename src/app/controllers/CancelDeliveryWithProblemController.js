import format from 'date-fns/format';

import { Op } from 'sequelize';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

import CancelledDeliveryMail from '../jobs/CancelledDeliveryMail';
import Queue from '../../lib/Queue';

class CancelDeliveryWithProblemController {
  async edit(req, res) {
    const { id } = req.params;

    const problemExists = await DeliveryProblem.findByPk(id);

    if (!problemExists) {
      return res.status(404).json({ error: 'Could not find problem' });
    }

    const cancelledOrder = await Order.findOne({
      where: {
        id: problemExists.delivery_id,
        end_date: {
          [Op.is]: null,
        },
        canceled_at: {
          [Op.is]: null,
        },
        start_date: {
          [Op.not]: null,
        },
      },
    });

    if (!cancelledOrder) {
      return res.status(400).json({
        error:
          'Order has not started, has already been cancelled, or has already ended',
      });
    }

    await cancelledOrder.update({
      canceled_at: new Date(),
    });

    const deliveryman = await Deliveryman.findByPk(
      cancelledOrder.deliveryman_id
    );

    // Sending email to deliveryman to notify that one of his/her deliveries was cancelled
    const formattedDate = format(new Date(), "MMMM dd', 'h':'mm' 'aaaa");
    await Queue.add(CancelledDeliveryMail.key, {
      deliveryman,
      order: cancelledOrder,
      formattedDate,
    });

    return res.json(cancelledOrder);
  }
}

export default new CancelDeliveryWithProblemController();
