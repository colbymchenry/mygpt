"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { MessagesSquare, MoreHorizontal, PencilIcon, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
import { FirebaseUtils } from "@/contexts/FirebaseContext";

export type BotRow = {
  id: string;
  name?: string;
  description?: string;
}

export const columns: ColumnDef<BotRow>[] = [

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, cell, table }) => {
      return <div className="flex flex-col">
        <span>{row.original.name}</span>
        <span className="text-xs text-gray-500 truncate max-w-[8rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-[50rem]">{row.original.description}</span>
      </div>
    }
  },
  {
    accessorKey: "controls",
    header: "",
    cell: ({ row, cell, table }) => {
      const firstRow: any = table.getRow("0")?.original;
      const router = firstRow.router;
      const init = firstRow.init;

      async function deleteBot(id: string) {
        try {
          await FirebaseUtils.deleteDocument("bots", id);
          toast.success("Bot deleted.");
          init();
        } catch (error) {
          console.error(error);
          toast.error("Unable to delete bot.");
        }
      }

      return <div className="flex items-stretch gap-2 justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="outline" onClick={() => deleteBot(row.original.id)}><Trash width={"1rem"} /></Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
              <Button type="button" size="icon" variant="default" onClick={() => router.push(`/chat/${row.original.id}`)}><MessagesSquare width={"1rem"} /></Button>
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

