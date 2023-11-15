export const onQR = (payload: any, callback: (payload: any) => void) => {
  callback(payload.qrCode);
};