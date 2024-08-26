import currency from "currency.js";

export const formatCurrency = (amount: number | null | undefined) => {
  return amount && currency(amount / 100).format();
};
