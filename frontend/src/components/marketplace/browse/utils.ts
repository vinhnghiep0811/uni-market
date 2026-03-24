const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatVndPrice(value: number) {
  return currencyFormatter.format(value);
}

export function formatPriceRangeLabel(value: number, ceiling: number) {
  if (value >= ceiling) {
    return `${formatVndPrice(ceiling)}+`;
  }

  return formatVndPrice(value);
}
