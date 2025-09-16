export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold">IBIAS Admin</h2>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}