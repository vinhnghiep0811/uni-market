import { formatVndPrice } from "../utils";

type ProductInfoProps = {
  title: string;
  price: number;
  description: string;
};

export default function ProductInfo({
  title,
  price,
  description,
}: ProductInfoProps) {
  return (
    <div className="space-y-2">
      {/* Title + Price cùng 1 hàng */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="shrink-0 text-xl font-bold text-slate-950">
          {formatVndPrice(price)}
        </p>
      </div>

      {/* Description bên dưới */}
      <p className="line-clamp-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
