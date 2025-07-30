export const generateReference = () =>
  "txn_" + Date.now() + Math.random().toString(36).substring(2, 10);
