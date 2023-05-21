
export class ProductAnalysis {
  constructor(
    public productId: number,
    public productName: string,
    public productCode: string,
    public buyPrice: any,
    public salePrice: any,
    public quantity: number,
    public saleAmount: any,
    public purchaseAmount?: any,
    public profit?: any,
    public profitPercentage?: any,
    public agentCommission?: any,
    public managerCommission?: any,
    public operationalCommission?: any,
    public discountAmount?: any,
    public revenue?: any,
   
  ) {}
}
