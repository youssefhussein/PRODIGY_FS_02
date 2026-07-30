"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { EmployeeRow } from "~/server/actions/employees";
import {
	createEmployee,
	deleteEmployee,
	updateEmployee,
} from "~/server/actions/employees";

type ModalMode = "add" | "edit" | "delete" | null;

export function EmployeeTable({ employees }: { employees: EmployeeRow[] }) {
	const router = useRouter();
	const [modal, setModal] = useState<ModalMode>(null);
	const [selected, setSelected] = useState<EmployeeRow | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		name: "",
		email: "",
		position: "",
		department: "",
		salary: "",
		hireDate: "",
	});

	const openAdd = useCallback(() => {
		setForm({
			name: "",
			email: "",
			position: "",
			department: "",
			salary: "",
			hireDate: "",
		});
		setError("");
		setSelected(null);
		setModal("add");
	}, []);

	const openEdit = useCallback((e: EmployeeRow) => {
		setForm({
			name: e.name,
			email: e.email,
			position: e.position ?? "",
			department: e.department ?? "",
			salary: e.salary?.toString() ?? "",
			hireDate: e.hireDate ?? "",
		});
		setError("");
		setSelected(e);
		setModal("edit");
	}, []);

	const openDelete = useCallback((e: EmployeeRow) => {
		setSelected(e);
		setError("");
		setModal("delete");
	}, []);

	const close = useCallback(() => {
		setModal(null);
		setSelected(null);
		setError("");
	}, []);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const data = {
				name: form.name,
				email: form.email,
				position: form.position,
				department: form.department,
				salary: form.salary ? Number(form.salary) : undefined,
				hireDate: form.hireDate,
			};

			if (modal === "add") {
				await createEmployee(data);
			} else if (modal === "edit" && selected) {
				await updateEmployee(selected.id, data);
			}

			router.refresh();
			close();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete() {
		if (!selected) return;
		setError("");
		setLoading(true);

		try {
			await deleteEmployee(selected.id);
			router.refresh();
			close();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="mb-4">
				<button
					className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700"
					onClick={openAdd}
					type="button"
				>
					+ New Employee
				</button>
			</div>

			<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-100 text-left dark:bg-gray-900">
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Name
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Email
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Position
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Department
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Salary
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Hire Date
							</th>
							<th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{employees.length === 0 && (
							<tr>
								<td
									className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
									colSpan={7}
								>
									No employees yet. Click &quot;+ New Employee&quot; to add one.
								</td>
							</tr>
						)}
						{employees.map((emp) => (
							<tr
								className="border-gray-200 border-t hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50"
								key={emp.id}
							>
								<td className="px-4 py-3">{emp.name}</td>
								<td className="px-4 py-3 text-gray-600 dark:text-gray-400">
									{emp.email}
								</td>
								<td className="px-4 py-3">{emp.position ?? "—"}</td>
								<td className="px-4 py-3">{emp.department ?? "—"}</td>
								<td className="px-4 py-3">
									{emp.salary != null ? `$${emp.salary.toLocaleString()}` : "—"}
								</td>
								<td className="px-4 py-3">{emp.hireDate || "—"}</td>
								<td className="px-4 py-3">
									<div className="flex gap-2">
										<button
											className="rounded px-2 py-1 font-medium text-blue-600 text-xs hover:bg-blue-50 dark:hover:bg-blue-950"
											onClick={() => openEdit(emp)}
											type="button"
										>
											Edit
										</button>
										<button
											className="rounded px-2 py-1 font-medium text-red-600 text-xs hover:bg-red-50 dark:hover:bg-red-950"
											onClick={() => openDelete(emp)}
											type="button"
										>
											Delete
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{modal === "add" || modal === "edit" ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
						<h3 className="mb-4 font-semibold text-lg">
							{modal === "add" ? "New Employee" : "Edit Employee"}
						</h3>

						<form className="space-y-3" onSubmit={handleSubmit}>
							<div>
								<label
									className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
									htmlFor="emp-name"
								>
									Name
								</label>
								<input
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
									id="emp-name"
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									required
									value={form.name}
								/>
							</div>
							<div>
								<label
									className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
									htmlFor="emp-email"
								>
									Email
								</label>
								<input
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
									id="emp-email"
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									required
									type="email"
									value={form.email}
								/>
							</div>
							<div>
								<label
									className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
									htmlFor="emp-position"
								>
									Position
								</label>
								<input
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
									id="emp-position"
									onChange={(e) =>
										setForm({ ...form, position: e.target.value })
									}
									value={form.position}
								/>
							</div>
							<div>
								<label
									className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
									htmlFor="emp-department"
								>
									Department
								</label>
								<input
									className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
									id="emp-department"
									onChange={(e) =>
										setForm({ ...form, department: e.target.value })
									}
									value={form.department}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
										htmlFor="emp-salary"
									>
										Salary
									</label>
									<input
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
										id="emp-salary"
										min="0"
										onChange={(e) =>
											setForm({ ...form, salary: e.target.value })
										}
										type="number"
										value={form.salary}
									/>
								</div>
								<div>
									<label
										className="mb-1 block font-medium text-gray-700 text-sm dark:text-gray-300"
										htmlFor="emp-hireDate"
									>
										Hire Date
									</label>
									<input
										className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
										id="emp-hireDate"
										onChange={(e) =>
											setForm({ ...form, hireDate: e.target.value })
										}
										type="date"
										value={form.hireDate}
									/>
								</div>
							</div>

							{error && <p className="text-red-600 text-sm">{error}</p>}

							<div className="flex justify-end gap-2 pt-2">
								<button
									className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
									onClick={close}
									type="button"
								>
									Cancel
								</button>
								<button
									className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 disabled:opacity-50"
									disabled={loading}
									type="submit"
								>
									{loading ? "Saving..." : "Save"}
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}

			{modal === "delete" && selected ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900">
						<h3 className="mb-2 font-semibold text-lg">Delete Employee</h3>
						<p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
							Are you sure you want to delete <strong>{selected.name}</strong>?
							This cannot be undone.
						</p>

						{error && <p className="mb-3 text-red-600 text-sm">{error}</p>}

						<div className="flex justify-end gap-2">
							<button
								className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
								onClick={close}
								type="button"
							>
								Cancel
							</button>
							<button
								className="rounded-md bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 disabled:opacity-50"
								disabled={loading}
								onClick={handleDelete}
								type="button"
							>
								{loading ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
