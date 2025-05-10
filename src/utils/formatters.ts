import { format } from "date-fns";
import { th } from "date-fns/locale";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString: string, formatStr = "PPP"): string => {
  return format(new Date(dateString), formatStr, { locale: th });
};
