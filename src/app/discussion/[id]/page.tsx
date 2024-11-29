export const dynamicParams = false;

export default async function ResponsePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const discussionId = (await params).id;
  return <div>{discussionId}</div>;
}
