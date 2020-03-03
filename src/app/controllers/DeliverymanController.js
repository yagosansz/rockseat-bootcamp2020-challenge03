import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }

  async store(req, res) {
    const { email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({ where: { email } });

    if (deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman already exists' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json({ deliveryman });
  }

  async edit(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist' });
    }

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman does not exist' });
    }

    await deliveryman.destroy();

    return res.status(200).json();
  }
}

export default new DeliverymanController();
