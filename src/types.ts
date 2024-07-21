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
  [x: string]: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
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
