import { useFormikContext } from "formik";
import React from "react";

const InnerForm = ({ setFormState }: {setFormState: (context: any) => void;}) => {
    const context = useFormikContext();
    React.useEffect(() => {
        setFormState(context)
    }, [context.isValid, context.isSubmitting, context.touched, context.submitForm, context.values]);

    return null;
}

export default InnerForm;