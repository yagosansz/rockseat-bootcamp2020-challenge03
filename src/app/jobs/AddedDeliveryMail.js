import Mail from '../../lib/Mail';

class AddedDeliveryMail {
  get key() {
    return 'AddedDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, order, formattedDate } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'New Delivery',
      template: 'new_delivery',
      context: {
        deliveryman: deliveryman.name,
        product: order.product,
        date: formattedDate,
      },
    });
  }
}

export default new AddedDeliveryMail();
