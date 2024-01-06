type ColId = 
  'name' | 'phone1' | 'phone2' | 'location' | 'ip' | 'created_at' | 'last_payment' | 
  'total_earnings' | 'bill' | 'status' | 'send_email' | 'ack_payment' | 'isDisconnected' | 
  'actions' | 'amount' | 'mac_address' | 'user_name' | 'purpose' |
  'assetPrice' | 'isForCompany' | 'accrue' | 'email'

export interface Column {
  id: ColId;
  label: string;
  minWidth?: number;
  width?: string;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
};

type Item = { name: string, quantity: number, unit_cost: number };

type Invoice = {
  number: string,
  date: string,
  poNumber?: string,
  dueDate: string,
  to: string,
  items: Item[],
  notes?: string,
  terms?: string,
  tax?: number,
  discount?: number,
  shipping?: number
};

export interface Row {
  userId?: string,
  name: string;
  phone1?: string;
  phone2?: string;
  location?: string;
  ip?: string;
  total_earnings?: number;
  status?: string;
  send_email?: string;
  ack_payment?: string;
  accrue?: string;
  isDisconnected?: string;
  created_at?: string;
  last_payment?: string;
  bill?: string;
  amount?: number;
  actions?: string;
  email?: string;
  package_name?: string;
  user_name?: string;
  mac_address?: string;
  purpose?: string;
  isForCompany?: string;
  assetPrice?: string;
  package?: string;
  userType?: string;
  invoice?: Invoice;
}

export interface AxiosErrorData {
  msg: string;
}

export interface User {
  id: string;
  phoneNo: string;
  email?: string;
  userType?: string;
}