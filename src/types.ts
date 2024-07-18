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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  creactedAt: string;
};
