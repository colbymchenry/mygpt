import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FirebaseUtils, useFirebase } from "@/contexts/FirebaseContext";
import { GPTMessage } from "@/lib/chatgpt";
import { array_move } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { CheckIcon, ChevronDown, ChevronUp, Loader2, PlayIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const Builder = (props: any) => {

    const router = useRouter();
    const { user } = useFirebase();
    const [messages, setMessages] = useState<GPTMessage[]>(props.messages || [{
        role: 'system',
        content: ''
    }]);

    const init = async () => {
        try {
            if (user?.uid) {
                const data: any = await FirebaseUtils.getDocument("settings", user.uid);
                if (!data?.apiKey) router.push('/settings');
            }
        } catch (error) {
            toast.error(`Error loading settings from server...`);
            console.error(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

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

    return (
        <div className="flex flex-col py-6">
            <div className="flex flex-col text-sm gap-2 mb-4">
                <span><strong>assistant</strong>: Give example replies to your questions.</span>
                <span><strong>system</strong>: Internally give some instructions for the conversation.</span>
            </div>
            {messages.map((msg: GPTMessage, index: number) => {
                return (
                    <>
                        <Message key={`message-${index}`} message={msg} index={index} moveUp={moveUp} moveDown={moveDown} updateMessage={updateMessage} addMessage={addMessage} />
                        {index > -1 && index < messages.length - 1 ? <Connector /> : null}
                    </>
                )
            })}
            <div className="flex md:flex-row flex-col items-stretch justify-end gap-4 mt-10">
                <Button type="button" onClick={addMessage} className="flex items-center gap-2"><PlusIcon width={"1rem"} /> Add Message</Button>
                <SaveDialog messages={messages} defaultName={props.name} defaultDescription={props.description} id={props.id} />
            </div>
        </div>
    );

}

type Message = {
    message: GPTMessage; index: number; moveUp: (index: number) => void; moveDown: (index: number) => void; updateMessage: (index: number, updateContent: any) => void; addMessage: () => void;
}

const Message = ({ message, index, moveUp, moveDown, updateMessage, addMessage }: Message) => {
    return (
        <div className="flex flex-col w-full px-2 py-4 md:p-6 rounded-lg border-solid border-gray-300 dark:border-gray-800 border bg-gray-100 dark:bg-gray-700 shadow-md gap-2">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Role:</span>
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
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {/* Ordering buttons */}
                <div className="flex items-stretch rounded-md overflow-hidden">
                    <Button type="button" variant="outline" size="icon" onClick={() => moveDown(index)} className="rounded-r-none"><ChevronDown width={"1rem"} /></Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => moveUp(index)} className="rounded-l-none"><ChevronUp width={"1rem"} /></Button>
                </div>
            </div>


            <div className="flex flex-col">
                {/* Textarea for message content */}
                <Textarea placeholder={message.role === 'system' ? 'Ex: You are an assistant that speaks like Shakespeare.' : 'Ex: To be, or not to be: that is the question.'}
                    value={message.content}
                    className={`dark:bg-gray-800`}
                    style={{ fontSize: "16px" }}
                    onChange={(event: any) => updateMessage(index, { content: event.target.value })} />
                <small className="text-gray-400">{message.content.replace(/\s/g, '').length} / 25 required characters.</small>
            </div>
        </div>
    )
}

const Connector = () => {
    return (
        <div className="flex items-center justify-center h-20 w-1 bg-gray-300 dark:bg-gray-400 overflow-visible" style={{ margin: '0 auto' }}>
            <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
            </span>
        </div>
    )
}

const SaveDialog = ({ messages, defaultName, defaultDescription, id }: { messages: GPTMessage[], defaultName?: string, defaultDescription?: string, id?: string }) => {
    const router = useRouter();
    const [working, setWorking] = useState<boolean>(false);
    const [name, setName] = useState<string>(defaultName || "");
    const [description, setDescription] = useState<string>(defaultDescription || "");

    const saveForm = async () => {
        if (working) return;
        setWorking(true);

        try {
            if (id) {
                await FirebaseUtils.setDocument("bots", id, {
                    messages,
                    name,
                    description
                });
            } else {
                await FirebaseUtils.createDocument("bots", {
                    messages,
                    name,
                    description
                });
            }
            toast.success('Bot configuration saved successfully!');
            router.push('/');
        } catch (error) {
            console.error(error);
        }

        setWorking(false);
    }

    const disableSave = useMemo(() => {
        return working || messages.length < 1 || messages.filter((msg: GPTMessage) => msg.content.replace(/\s/g, '').length < 25).length > 0;
    }, [messages, working]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" className="flex items-center gap-2" disabled={disableSave}><SaveIcon width={"1rem"} /> Save</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Save bot</DialogTitle>
                    <DialogDescription>
                        Confirm your bots name and description.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" placeholder="Shakespeare" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description" placeholder="A bot that talks like Shakespeare..." className="col-span-3" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={disableSave}
                        onClick={saveForm} type="button" variant="secondary" className="flex items-center gap-2">{working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckIcon width={"1rem"} />} Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Builder;