export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1>Account Details for ID: {id}</h1>
    </div>
  );
}
