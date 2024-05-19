export interface simplifiedProduct {
    _id: string;
    imageUrl: string;
    price: number;
    code: string;
    categoryName: string;
    name: string;
  }
  
  export interface fullProduct {
    _id: string;
    images: any;
    price: number;
    code: string;
    categoryName: string;
    name: string;
    description: string;
    price_id: string;
  }