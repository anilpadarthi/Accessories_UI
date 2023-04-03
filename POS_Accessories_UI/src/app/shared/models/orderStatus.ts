export class OrderStatus {
  constructor(
    public orderId?: number,
    public orderStatus?: string,
    public paymentMethod?: string,
    public shippingMode?: string,
    public trackNumber?: string,
    public shippingAddress?: string
  ) {}
}
