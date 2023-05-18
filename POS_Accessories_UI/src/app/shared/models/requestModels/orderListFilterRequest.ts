
export class OrderListFilterRequest {
  constructor(
    public orderStatusId?: number,
    public paymentMethodId?: number,
    public shippingModeId?: number,
    public agentId?: number,
    public managerId?: number,
    public areaId?: number,
    public shopId?: any,
    public fromDate?: any,
    public toDate?: number,
    public orderId?: any,
    public trackingNumber?: any,
    public isVat?: any,
    public pageNo?: number,
    public pageSize?: number,
  ) {}
}
