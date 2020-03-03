import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object.shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      street_name: Yup.string().required(),
      street_number: Yup.string().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      postal_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

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
    const schema = Yup.object.shape({
      name: Yup.string(),
      email: Yup.string().email(),
      street_name: Yup.string(),
      street_number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      postal_code: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

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
