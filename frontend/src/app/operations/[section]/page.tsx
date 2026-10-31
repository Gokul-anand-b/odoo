import OperationsSectionView from '@/features/operations/OperationsSectionView';

export function generateStaticParams() {
  return [
    { section: 'agreements' },
    { section: 'finance' },
    { section: 'guests' },
    { section: 'vendors' },
    { section: 'documents' },
    { section: 'notifications' },
  ];
}

export default async function OperationsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <OperationsSectionView section={section} />;
}
