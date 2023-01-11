export type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type FormActionData = {
  form: string;
  error?: string;
  errors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  fields?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
};
