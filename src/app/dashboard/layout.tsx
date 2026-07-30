import { redirect } from "next/navigation";
import { DashboardHeader } from "~/app/dashboard/header";
import { getSession } from "~/server/better-auth/server";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (!session) redirect("/login");

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			<DashboardHeader />
			<main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
		</div>
	);
}
