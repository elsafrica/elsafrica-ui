type ColId = 'name' | 'phone1' | 'phone2' | 'location' | 'ip' | 'created_at' | 'last_payment' | 'total_earnings' | 'bill' | 'status' | 'send_email' | 'ack_payment' | 'isDisconnected' 

export interface Column {
  id: ColId;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
};

export interface Row {
  userId?: string,
  name: string;
  phone1: string;
  phone2?: string;
  location?: string;
  ip?: string;
  total_earnings?: number;
  status?: string;
  send_email?: string;
  ack_payment?: string;
  isDisconnected?: string;
  created_at?: string;
  last_payment?: string;
  bill?: number;
}

export interface AxiosErrorData {
  msg: string;
}