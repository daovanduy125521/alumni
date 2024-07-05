
export interface Toast {
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'loading';
  duration: number;
}
