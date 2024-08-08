export type Credentials = {
  email: string;
  password: string;
};

export interface IError {
  config: unknown;
  response: {
    data: {
      errors: {
        msg: string;
        location: string;
        method: string;
        path: string;
        ref: string;
        stack: string | null;
        type: string;
      }[];
    };
  };
}

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenant?: TenantTypes | null;
  createdAt: string;
  updatedAt: string;
};

export type CreacteUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};
export type TenantTypes = {
  _id: string;
  name: string;
  address: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
};
export type FieldData = {
  name: string[];
  value: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "aditional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}
export type Categories = {
  _id?: string;
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
};
export interface UserQueryParams {
  page: number;
  limit: number;
  q?: string;
}

export type ProductAttributes = {
  name: string;
  value: string | boolean;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Categories;
  priceConfiguration: PriceConfiguration;
  attributes: ProductAttributes[];
  image: string;
  isPublish: boolean;
  createdAt: string;
};

export type ImageField = {
  file: File;
};
export type CreateProductData = Product & { image: ImageField };

export type PromosTypes = {
  _id: string;
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export type Topping = {
  _id: string;
  name: string;
  image: string;
  price: number;
};
export interface CartItem
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}
export type Address = {
  text: string;
  isDefault: boolean;
};
export type Customer = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: Address[];
};

export enum PaymentMode {
  CARD = "card",
  CASH = "cash",
}

export enum OrderStatus {
  PECEIVED = "received",
  CONFIRMED = "confirmed",
  PREPARED = "prepared",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}
export interface Order {
  _id: string;
  image: string;
  cart: CartItem[];
  customerId: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharge: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}
