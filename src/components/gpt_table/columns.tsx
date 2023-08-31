"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { MessagesSquare, MoreHorizontal, PencilIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/router";

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
  },
  {
    accessorKey: "controls",
    header: "",
    cell: ({ row, cell, table }) => {
      const router = useRouter();
      return <div className="flex items-stretch gap-2 justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="secondary" onClick={() => router.push(`/bot/${row.original.id}`)}><PencilIcon width={"1rem"} /></Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="secondary" onClick={() => router.push(`/chat/${row.original.id}`)}><MessagesSquare width={"1rem"} /></Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    }
  }
]

