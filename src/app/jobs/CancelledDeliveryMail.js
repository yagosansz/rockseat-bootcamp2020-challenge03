import Mail from '../../lib/Mail';

class CancelledDeliveryMail {
  get key() {
    return 'CancelledDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, order, formattedDate } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Delivery Cancelled',
      template: 'cancelled_delivery',
      context: {
        deliveryman: deliveryman.name,
        product: order.product,
        date: formattedDate,
      },
    });
  }
}

export default new CancelledDeliveryMail();
