"use client";

import { ColumnDef } from "@tanstack/react-table"

export type UserRow = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street1: string;
    string2?: string;
    state: string;
    zip: string;
    city: string;
  }
}

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "firstName",
    header: "First name",
  },
  {
    accessorKey: "lastName",
    header: "Last name",
  },
  {
    accessorKey: "email",
    header: "Email",
  }
]

