import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFirebase } from "@/contexts/FirebaseContext";
import { GPTMessage } from "@/lib/chatgpt";
import { array_move } from "@/lib/utils";
import { ChevronDown, ChevronUp, PlusIcon } from "lucide-react";
import { useState } from "react";

const Builder = () => {
    const [messages, setMessages] = useState<GPTMessage[]>([{
        role: 'system',
        content: ''
    }]);
    const [working, setWorking] = useState<boolean>(false);
    const { firestore } = useFirebase();



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
        <div className="flex flex-col">
            {messages.map((msg: GPTMessage, index: number) => {
                return (
                    <>
                        <Message key={`message-${index}`} message={msg} index={index} moveUp={moveUp} moveDown={moveDown} updateMessage={updateMessage} addMessage={addMessage} />
                        {index > -1 && index < messages.length - 1 ? <Connector /> : null}

                    </>
                )
            })}
            <Button type="button" onClick={addMessage} className="mt-10"><PlusIcon width={"1rem"} /> Add Message</Button>
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
                                <SelectItem value="user">user</SelectItem>
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
                <Textarea placeholder={message.role === 'system' ? 'Ex: You are an assistant that speaks like Shakespeare.' : message.role === 'user' ? 'Ex: tell me a joke' : 'Ex: why did the chicken cross the road'}
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

export default Builder;