import { Button } from "@/components/ui/button";
import { SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, Loader2, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { GPTMessage } from "@/lib/chatgpt";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { array_move } from "@/lib/utils";
import { useFirebase } from "@/contexts/FirebaseContext";

const GPTSlide = ({ id }: { id?: string; }) => {
    const [messages, setMessages] = useState<GPTMessage[]>([]);
    const [working, setWorking] = useState<boolean>(false);
    const { firestore } = useFirebase();

    // TODO: Work on saving form
    const saveForm = async () => {
        if (working) return;
        setWorking(true);

        try {
            if (id) {

            }
        } catch (error) {
            console.error(error);
        }

        setWorking(false);
    }

    return (
        <>
            <SheetContent className="flex flex-col w-[90vw]">
                <SheetHeader>
                    <SheetTitle>BOT Builder</SheetTitle>
                </SheetHeader>
                <div className="pt-6 px-2 flex-grow overflow-auto">
                    <div className="flex flex-col mb-4">
                        <div className="flex flex-col text-sm gap-2">
                            <span><strong>user</strong>: You/who is asking</span>
                            <span><strong>assistant</strong>: Give example replies to your (&quot;user&quot; role) questions.</span>
                            <span><strong>system</strong>: Internally give some instructions for the conversation.</span>
                        </div>
                    </div>
                    <GPTForm setMessages={setMessages} />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" onClick={saveForm} disabled={working || messages.length < 1 || messages.filter((msg: GPTMessage) => msg.content.replace(/\s/g, '').length < 25).length > 0}>{working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </>
    )
}

const GPTForm = (props: any) => {
    const [messages, setMessages] = useState<GPTMessage[]>([]);

    const addMessage = () => setMessages((messages: GPTMessage[]) => [...messages, {
        role: 'system',
        content: ''
    }]);

    const updateMessage = (index: number, updateContent: any) => setMessages((messages: GPTMessage[]) => {
        return messages.map((msg: GPTMessage, index2: number) => index === index2 ? Object.assign(msg, updateContent) : msg);
    });

    const moveUp = (index: number) => {
        let newArray = [...messages];
        newArray = array_move(newArray, index, index - 1 < 0 ? 0 : index - 1);
        setMessages(newArray);
    }

    const moveDown = (index: number) => {
        let newArray = [...messages];
        newArray = array_move(newArray, index, index + 1 > newArray.length - 1 ? newArray.length - 1 : index + 1);
        setMessages(newArray);
    }

    useEffect(() => {
        props.setMessages(messages);
    }, [messages]);

    const renderMessages = () => {
        return messages.map((message: GPTMessage, index: number) => {
            return <div key={`message-${index}`} className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                    {/* Selection for message role */}
                    <Select value={message.role} onValueChange={(value: string) => updateMessage(index, { role: value })}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem value="system">system</SelectItem>
                                <SelectItem value="assistant">assistant</SelectItem>
                                <SelectItem value="user">user</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* Ordering buttons */}
                    <div className="flex items-stretch rounded-md overflow-hidden">
                        <Button type="button" variant="outline" size="icon" onClick={() => moveDown(index)} className="rounded-r-none"><ChevronDown width={"1rem"} /></Button>
                        <Button type="button" variant="outline" size="icon" onClick={() => moveUp(index)} className="rounded-l-none"><ChevronUp width={"1rem"} /></Button>
                    </div>
                </div>
                {/* Textarea for message content */}
                <Textarea placeholder={message.role === 'system' ? 'You are an assistant that speaks like Shakespeare.' : message.role === 'user' ? 'tell me a joke' : 'why did the chicken cross the road'}
                    value={message.content}
                    onChange={(event: any) => updateMessage(index, { content: event.target.value })} />
                <small className="text-gray-400">{message.content.replace(/\s/g, '').length} / 25 required characters.</small>
                {index < messages.length - 1 ?
                    <div className="my-4">
                        <div className="fade_rule" />
                    </div> : null}
            </div>
        });
    }

    return (
        <div className="flex flex-col gap-1.5">
            {renderMessages()}
            <Button type="button" variant="secondary" onClick={addMessage} className="mt-4"><PlusIcon width={"1rem"} /> Add Message</Button>
        </div>
    )

}

export default GPTSlide;