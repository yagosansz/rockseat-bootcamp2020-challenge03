import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const { email } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { email },
    });

    if (recipientExists) {
      res.status(400).json({ error: 'Recipient already exists' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async edit(req, res) {
    const { email } = req.body;

    let recipient = await Recipient.findOne({ where: { email } });

    if (!recipient) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }
}
export default new RecipientController();
