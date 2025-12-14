export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface CounterState {
  value: number;
  step: number;
}

export type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "setStep"; payload: number };

export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}
