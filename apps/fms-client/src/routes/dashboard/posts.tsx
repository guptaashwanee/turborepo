import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/posts")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/dashboard/posts"!</div>;
}
