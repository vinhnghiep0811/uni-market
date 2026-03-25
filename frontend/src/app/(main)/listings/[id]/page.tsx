import ListingDetailPage from "@/components/marketplace-detail/ListingDetailPage";

type ListingDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailRoute({
  params,
}: ListingDetailRouteProps) {
  const { id } = await params;

  return <ListingDetailPage listingId={id} />;
}
