import { SubCategory } from "./subCategory";

export class Category {
  constructor(public categoryId: number, 
              public categoryName:string,
              public image: string,
              public subCategories?: SubCategory[]){ }
}
