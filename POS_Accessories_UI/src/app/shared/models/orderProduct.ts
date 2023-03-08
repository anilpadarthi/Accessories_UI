export class OrderProduct {
  constructor(
    public productId: number,
    public quantity: number,
    public price?: number,
    public productColourId?: number,
    public productSizeId?: number,
    public productName?: string,
    public productCode?: string
  ) {}
}
