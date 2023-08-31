import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FirebaseUtils, useFirebase } from "@/contexts/FirebaseContext";
import { setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'sonner';

const Settings = () => {

    const { user } = useFirebase();
    const [apiKey, setApiKey] = useState<string>("");
    const [working, setWorking] = useState<boolean>(false);

    const saveSettings = async () => {
        if (working) return;
        setWorking(true);
        try {
            if (user?.uid) {
                await FirebaseUtils.setDocument("settings", user.uid, {
                    apiKey
                });
                toast.success('Settings saved!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Save failed!');
        }
        setWorking(false);
    }

    const init = async () => {
        try {
            if (user?.uid) {
                const data: any = await FirebaseUtils.getDocument("settings", user.uid);
                if (data?.apiKey) setApiKey(data.apiKey);
            }
        } catch (error) {
            toast.error(`Error loading settings from server...`);
            console.error(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col space-y-1.5 max-w-[500px]">
                <Label htmlFor="name">ChatGPT API Key</Label>
                <Input value={apiKey} onChange={(e: any) => setApiKey(e.target.value)} placeholder="sk-vhLZVsoQK...." />
            </div>

            <Button type="button" onClick={saveSettings} className="self-start" disabled={working}>{working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Save</Button>
        </div>
    )

}

export default Settings;

