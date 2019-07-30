export interface Saga {
  type: string;
  saga: any;
}

export interface SagaArg<T> {
  payload: T;
}
