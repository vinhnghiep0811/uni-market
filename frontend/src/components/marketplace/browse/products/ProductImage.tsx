import type { ReactNode } from "react";
import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  objectPosition: string;
  overlayClassName: string;
  children?: ReactNode;
};

export default function ProductImage({
  src,
  alt,
  objectPosition,
  overlayClassName,
  children,
}: ProductImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[24px]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        style={{ objectPosition }}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="absolute left-4 top-4">{children}</div>
    </div>
  );
}
