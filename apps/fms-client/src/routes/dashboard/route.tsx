import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <ul className="flex flex-col space-y-2">
          <li>
            <Link
              to="/dashboard"
              activeOptions={{ exact: true }}
              className="[&.active]:font-bold"
            >
              Root
            </Link>
          </li>
          <li>
            <Link to="/dashboard/posts" className="[&.active]:font-bold">
              Posts
            </Link>
          </li>
        </ul>
      </aside>
      <section className="flex-1 p-6">
        <Outlet />
      </section>
    </div>
  );
}
