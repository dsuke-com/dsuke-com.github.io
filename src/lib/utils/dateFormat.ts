import { format } from "date-fns";
import { ja } from "date-fns/locale";

const dateFormat = (
  date: Date | string,
  pattern: string = "yyyy年M月d日",
): string => {
  const dateObj = new Date(date);
  return format(dateObj, pattern, { locale: ja });
};

export default dateFormat;
