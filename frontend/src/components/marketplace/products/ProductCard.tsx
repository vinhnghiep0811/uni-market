import type { MarketplaceCategory, MarketplaceProduct } from "../types";
import CategoryBadge from "./CategoryBadge";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import SellerInfo from "./SellerInfo";

type ProductCardProps = {
  product: MarketplaceProduct;
  category: MarketplaceCategory;
};

export default function ProductCard({
  product,
  category,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70">
      <ProductImage
        src={product.imageSrc}
        alt={product.imageAlt}
        objectPosition={product.imagePosition}
        overlayClassName={product.imageOverlayClassName}
      >
        <CategoryBadge
          label={category.name}
          className={category.badgeClassName}
        />
      </ProductImage>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        <ProductInfo
          title={product.title}
          price={product.price}
          description={product.description}
        />
        <div className="mt-auto">
          <SellerInfo
            seller={product.seller}
            listedAtLabel={product.listedAtLabel}
          />
        </div>
      </div>
    </article>
  );
}
