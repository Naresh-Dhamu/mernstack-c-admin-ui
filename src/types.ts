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
  userId: string;
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

export type Product = {
  _id: string;
  name: string;
  description: string;
  category: Categories;
  image: string;
  isPublish: boolean;
  createdAt: string;
};

export type ImageField = {
  file: File;
};
export type CreateProductData = Product & { image: ImageField };
