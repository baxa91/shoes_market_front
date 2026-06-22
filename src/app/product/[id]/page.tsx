import ProductDetail from "@/app/components/catalog/ProductDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  return <ProductDetail productId={id} />;
}