import { useRouter } from "next/router";
import Builder from "../builder";
import { useEffect, useState } from "react";
import { FirebaseUtils } from "@/contexts/FirebaseContext";

const EditBot = () => {

    const router: any = useRouter();
    const [doc, setDoc]: any = useState();

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
    }, []);

    if (!doc) {
        return <div>Loading</div>
    }

    return <Builder {...doc} id={router.query.id} />;
}

export default EditBot;