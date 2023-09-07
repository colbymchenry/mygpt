import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GPTTable from "@/components/gpt_table/data-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col w-full gap-6 md:gap-12 py-6">
      <div className="flex flex-col md:flex-row w-full items-stretch justify-between gap-3">
        <div className="flex items-stretch gap-2 w-auto md:w-[30rem]">
          <Input placeholder="Search bots..." />
          <Button type="button" className="flex-shrink">Search</Button>
        </div>

        <Button type="button" className="flex-shrink items-center gap-1.5 self-start hidden md:flex" variant="secondary" asChild>
          <Link href="/builder">
            <PlusIcon width={"1rem"} /> Add Bot
          </Link>
        </Button>
      </div>

      <GPTTable />

      <Button type="button" className="md:hidden flex-shrink flex items-center gap-1.5 self-start" variant="secondary" asChild>
        <Link href="/builder">
          <PlusIcon width={"1rem"} /> Add Bot
        </Link>
      </Button>
    </div>
  )

}

export default Home;