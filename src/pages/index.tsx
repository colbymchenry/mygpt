import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import GPTTable from "@/components/gpt_table/data-table";
import GPTSlide from "@/components/gpt_slide";
import { PlusIcon } from "lucide-react";

const Home = () => {

  return (
    <Sheet>
      <div className="flex flex-col w-full gap-6 md:gap-12">
        <div className="flex flex-col md:flex-row w-full items-stretch justify-between gap-3">
          <div className="flex items-stretch gap-2 w-auto md:w-[30rem]">
            <Input placeholder="Search bots..." />
            <Button type="button" className="flex-shrink">Search</Button>
          </div>

          <SheetTrigger asChild>
            <Button type="button" className="flex-shrink items-center gap-1.5 self-start hidden md:flex" variant="secondary"><PlusIcon width={"1rem"} /> Add Bot</Button>
          </SheetTrigger>
        </div>

        <GPTTable />

        <SheetTrigger asChild>
          <Button type="button" className="md:hidden flex-shrink flex items-center gap-1.5 self-start" variant="secondary"><PlusIcon width={"1rem"} /> Add Bot</Button>
        </SheetTrigger>
      </div>
      <GPTSlide />
    </Sheet>
  )

}

export default Home;