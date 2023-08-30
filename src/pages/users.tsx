import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/ui/error";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UsersTable from "@/components/users_table/data-table";
import { Formik } from "formik";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import InnerForm from "@/components/inner_form";

const UsersPage = () => {

    return (
        <Sheet>
            <div className="flex flex-col w-full gap-6 md:gap-12">
                <div className="flex flex-col md:flex-row w-full items-stretch justify-between gap-3">
                    <div className="flex items-stretch gap-2 w-auto md:w-[30rem]">
                        <Input placeholder="Search users..." />
                        <Button type="button" className="flex-shrink">Search</Button>
                    </div>

                    <SheetTrigger asChild>
                        <Button type="button" className="flex-shrink items-center gap-1.5 self-start hidden md:flex" variant="secondary"><PlusIcon width={"1rem"} /> Add User</Button>
                    </SheetTrigger>
                </div>

                <UsersTable />

                <SheetTrigger asChild>
                    <Button type="button" className="md:hidden flex-shrink flex items-center gap-1.5 self-start" variant="secondary"><PlusIcon width={"1rem"} /> Add User</Button>
                </SheetTrigger>
            </div>
            <UserSlide />
        </Sheet>
    )

}

const UserSlide = () => {
    return (
        <>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="pt-6">
                    <UserForm />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </>
    )
}

const UserForm = () => {
    const [formState, setFormState] = useState();

    const onSubmit = async (values: any, helpers: any) => {

    }

    const formSchema = {
        email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        password: Yup.string().required("Password is required")
    }

    return (
        <Formik onSubmit={onSubmit} initialValues={{ email: '', password: '' }} validationSchema={Yup.object().shape(formSchema)}>
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                isValid,
            }) => (
                <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">

                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" onChange={handleChange} onBlur={handleBlur} />
                        <Error>{touched.email && errors.email ? touched.email && errors.email : null}</Error>
                    </div>
                    <InnerForm setFormState={setFormState} />
                </form>
            )}
        </Formik>
    )

}

export default UsersPage;