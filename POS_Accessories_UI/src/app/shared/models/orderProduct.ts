export class OrderProduct {
  constructor(
    public productId: number,
    public qty: number,
    public salePrice?: number,
    public productColourId?: number,
    public productSizeId?: number,
    public productName?: string,
    public productCode?: string
  ) {}
}
