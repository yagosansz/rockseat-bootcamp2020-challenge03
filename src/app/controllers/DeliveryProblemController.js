import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const deliveriesWithProblems = await DeliveryProblem.findAll({
      attributes: ['id', 'description', 'delivery_id'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: [
            'recipient_id',
            'deliveryman_id',
            'product',
            'start_date',
            'canceled_at',
            'end_date',
          ],
        },
      ],
    });

    if (!deliveriesWithProblems.length) {
      return res
        .status(404)
        .json({ error: 'No deliveries with problems were found' });
    }

    return res.json(deliveriesWithProblems);
  }

  async show(req, res) {
    const { id } = req.params;

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      res.status(404).json({ error: 'Could not find order' });
    }

    const deliveryWithProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });

    return res.json(deliveryWithProblems);
  }

  async store(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      res.status(404).json({ error: 'Could not find order' });
    }

    const deliveryWithProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryWithProblem);
  }
}

export default new DeliveryProblemController();
