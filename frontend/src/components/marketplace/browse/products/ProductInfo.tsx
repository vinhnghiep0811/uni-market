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
    <div className="space-y-3">
      <div className="space-y-2">
        <h3 className="min-h-14 line-clamp-2 text-lg font-semibold leading-7 text-slate-900">
          {title}
        </h3>
        <p className="text-xl font-bold text-slate-950">{formatVndPrice(price)}</p>
      </div>

      <p className="min-h-12 line-clamp-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
