import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FirebaseUtils, useFirebase } from "@/contexts/FirebaseContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/contexts/ApiContext";
import { TypeAnimation } from 'react-type-animation';

type Message = {
    content: string;
    role: 'system' | 'assistant' | 'user';
}

const ChatRoom = () => {

    const api = useApi();
    const router: any = useRouter();
    const { user } = useFirebase();
    const [doc, setDoc]: any = useState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState<string>("");
    const [working, setWorking] = useState<boolean>(false);
    const dummyDiv: any = useRef(null);

    const init = async () => {
        try {
            const doc = await FirebaseUtils.getDocument(`bots`, router.query.id);
            if (doc && user) {
                let settingsDoc: any = await FirebaseUtils.getDocument("settings", user.uid);
                setDoc({ ...doc, apiKey: settingsDoc.apiKey });
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (dummyDiv.current) {
            dummyDiv.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSubmit = async (event?: any) => {
        if (event) {
            event.preventDefault(true);
            event.stopPropagation(true);
        }

        if (working) return;

        setMessages((oldMessages) => [...oldMessages, {
            role: 'user',
            content: text
        }]);

        setText("");

        setWorking(true);

        try {
            const res = await api.post('/api/message', {
                messages, message: text, botConfig: doc.messages, apiKey: doc.apiKey
            });

            if (res.data.messages) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error(error);
            toast.error("Sorry, we could not complete that request.");
        }

        setWorking(false);
    }

    if (!doc) {
        return <div>Loading</div>;
    }

    return (
        <div className="flex flex-col transition-all gap-2">
            {messages.map((msg: Message, index: number) => {
                return (
                    <div key={`message-${index}`} className={`msg ${msg.role === 'user' ? `user` : `bot`}`}>
                        {index === messages.length - 1 && msg.role !== 'user' ? <TypeAnimation
                            sequence={[
                                msg.content
                            ]}
                            wrapper="span"
                            speed={99}
                        /> : msg.content}
                    </div>
                )
            })}

            {working ? <div className="msg bot"><Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" /></div> : null}

            <div ref={dummyDiv}></div>

            <form className="sticky bottom-0 left-0 w-full bg-white dark:!bg-[#020817] pb-6 pt-6 mt-6 border-t-2 border-solid border-gray-200 dark:border-gray-600" onSubmit={handleSubmit}>
                <Textarea placeholder={'Send a message'}
                    value={text}
                    className={`dark:bg-gray-800 pr-14`}
                    style={{ fontSize: "16px" }}
                    onChange={(event: any) => setText(event.target.value)}
                    onKeyDown={(event: any) => {
                        if (event.keyCode == 13) {
                            handleSubmit()
                        }
                        if (event.keyCode == 13 && !event.shiftKey) {
                            handleSubmit()
                        }
                    }}
                />
                <Button type="submit" variant={"default"} size="icon" className="absolute bottom-8 right-4">
                    {working ? <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" /> : <SendHorizonal className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
                </Button>
            </form>
        </div>
    )

}

export default ChatRoom;