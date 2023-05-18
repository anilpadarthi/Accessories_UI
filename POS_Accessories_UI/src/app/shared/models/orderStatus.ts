export class OrderStatus {
  constructor(
    public orderId?: number,
    public orderStatusId?: number,
    public paymentMethodId?: number,
    public shippingModeId?: number,
    public trackingNumber?: string,
    public shippingAddress?: string
  ) {}
}
