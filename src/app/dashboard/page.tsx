import { EmployeeTable } from "~/app/dashboard/employee-table";
import { getEmployees } from "~/server/actions/employees";
import { getSession } from "~/server/better-auth/server";

export default async function DashboardPage() {
	const session = await getSession();
	const employees = await getEmployees();

	return (
		<div>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-xl">Employees</h2>
				<p className="text-gray-500 text-sm dark:text-gray-400">
					Logged in as {session?.user?.email}
				</p>
			</div>
			<EmployeeTable employees={employees} />
		</div>
	);
}
