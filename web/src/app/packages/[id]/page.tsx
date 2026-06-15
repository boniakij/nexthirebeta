import PackageContent from './package-content';

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PackageContent packageId={id} />;
}
