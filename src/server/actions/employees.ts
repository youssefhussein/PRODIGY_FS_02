"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSession } from "~/server/better-auth/server";
import { db } from "~/server/db";
import { employee } from "~/server/db/schema";

const employeeSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	position: z.string().optional().default(""),
	department: z.string().optional().default(""),
	salary: z.coerce.number().int().positive().optional(),
	hireDate: z.string().optional().default(""),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

function toDate(dateStr: string): Date | null {
	if (!dateStr) return null;
	const d = new Date(dateStr);
	return Number.isNaN(d.getTime()) ? null : d;
}

function toDateString(value: Date | number | null | undefined): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(value * 1000);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().split("T")[0] ?? "";
}

async function requireSession() {
	const session = await getSession();
	if (!session?.user?.id) throw new Error("Unauthorized");
	return session.user.id;
}

export async function createEmployee(data: EmployeeFormData) {
	const userId = await requireSession();
	const parsed = employeeSchema.parse(data);

	await db.insert(employee).values({
		userId,
		name: parsed.name,
		email: parsed.email,
		position: parsed.position || null,
		department: parsed.department || null,
		salary: parsed.salary ?? null,
		hireDate: toDate(parsed.hireDate),
	});

	revalidatePath("/dashboard");
}

export async function updateEmployee(id: number, data: EmployeeFormData) {
	const userId = await requireSession();
	const parsed = employeeSchema.parse(data);

	const existing = await db.query.employee.findFirst({
		where: (e, { eq, and }) => and(eq(e.id, id), eq(e.userId, userId)),
	});

	if (!existing) throw new Error("Not found");

	await db
		.update(employee)
		.set({
			name: parsed.name,
			email: parsed.email,
			position: parsed.position || null,
			department: parsed.department || null,
			salary: parsed.salary ?? null,
			hireDate: toDate(parsed.hireDate),
		})
		.where(eq(employee.id, id));

	revalidatePath("/dashboard");
}

export async function deleteEmployee(id: number) {
	const userId = await requireSession();

	const existing = await db.query.employee.findFirst({
		where: (e, { eq, and }) => and(eq(e.id, id), eq(e.userId, userId)),
	});

	if (!existing) throw new Error("Not found");

	await db.delete(employee).where(eq(employee.id, id));

	revalidatePath("/dashboard");
}

export type EmployeeRow = {
	id: number;
	userId: string;
	name: string;
	email: string;
	position: string | null;
	department: string | null;
	salary: number | null;
	hireDate: string;
	createdAt: Date | null;
	updatedAt: Date | null;
};

export async function getEmployees(): Promise<EmployeeRow[]> {
	const userId = await requireSession();

	const rows = await db.query.employee.findMany({
		where: (e, { eq }) => eq(e.userId, userId),
		orderBy: (e, { desc }) => desc(e.createdAt),
	});

	return rows.map((r) => ({
		...r,
		hireDate: toDateString(r.hireDate),
		createdAt: r.createdAt ?? null,
		updatedAt: r.updatedAt ?? null,
	}));
}

export async function getEmployee(id: number) {
	const userId = await requireSession();

	const row = await db.query.employee.findFirst({
		where: (e, { eq, and }) => and(eq(e.id, id), eq(e.userId, userId)),
	});

	if (!row) return null;

	return {
		...row,
		hireDate: toDateString(row.hireDate),
		createdAt: row.createdAt ?? null,
		updatedAt: row.updatedAt ?? null,
	};
}
