import type { MarketplaceSeller } from "../types";
import SellerActions from "./SellerActions";

type SellerInfoProps = {
  seller: MarketplaceSeller;
  listedAtLabel: string;
};

export default function SellerInfo({
  seller,
  listedAtLabel,
}: SellerInfoProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${seller.avatarClassName}`}
        >
          {seller.initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {seller.name}
          </p>
          <p className="text-xs text-slate-500">{listedAtLabel}</p>
        </div>
      </div>

      <SellerActions />
    </div>
  );
}
