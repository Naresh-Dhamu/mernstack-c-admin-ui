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
