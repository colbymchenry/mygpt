import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FirebaseUtils } from "@/contexts/FirebaseContext";
import { Textarea } from "@/components/ui/textarea";

type Message = {
    content: string;
    role: 'system' | 'assistant' | 'user';
}

const ChatRoom = () => {

    const router: any = useRouter();
    const [doc, setDoc]: any = useState();
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState<string>("");

    const init = async () => {
        try {
            const doc = await FirebaseUtils.getDocument(`bots`, router.query.id);
            if (doc) {
                setDoc(doc);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        init();
    });

    if (!doc) {
        return <div>Loading</div>;
    }

    return (
        <div className="flex flex-col">
            {messages.map((msg: Message, index: number) => {
                return (
                    <div key={`message-${index}`} className={`p-2 msg ${msg.role === 'user' ? `user` : `bot`}`}>
                        {msg.content}
                    </div>
                )
            })}

            <div>
                <Textarea placeholder={'Type anything here...'}
                    value={text}
                    className={`dark:bg-gray-800`}
                    style={{ fontSize: "16px" }}
                    onChange={(event: any) => setText(event.target.value)} />
            </div>
        </div>
    )

}

export default ChatRoom;