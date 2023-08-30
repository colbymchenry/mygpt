"use client";

import { ColumnDef } from "@tanstack/react-table"

export type BotRow = {
  id: string;
  name?: string;
  description?: string;
}

export const columns: ColumnDef<BotRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  }
]

