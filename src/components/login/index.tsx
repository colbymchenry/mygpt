import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode_toggle";
import { useEffect, useState } from "react";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Formik } from "formik";
import * as Yup from "yup";
import InnerForm from "@/components/inner_form";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import { useRouter } from "next/router";
import { Error } from "../ui/error";

export default function LoginCard() {

  const router = useRouter();
  const { auth, user } = useFirebase();
  const [formState, setFormState]: any = useState({});

  const formSchema = {
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().required("Password is required")
  }

  async function onSubmit(values: any, helpers: any) {
    try {
      await auth.setPersistence(browserSessionPersistence);
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      console.log(error.code);
      switch(error.code) {
        case 'auth/user-not-found': {
          helpers.setErrors({
            email: 'Email does not exist'
          });
          break;
        }
        case 'auth/wrong-password': {
          helpers.setErrors({
            password: 'Incorrect password'
          });
          break;
        }
        case 'auth/too-many-requests': {
          helpers.setErrors({
            password: 'Login temporarily disabled. Try again later.'
          })
        }
      }
    }
  }

  useEffect(() => {
    if (user) router.push("/app");
  }, [user]);

  return (
    <Card className="w-[350px] relative">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials below.</CardDescription>
      </CardHeader>
      <CardContent>
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
              <div className="absolute top-6 right-6">
                <ModeToggle />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john.doe@example.com" onChange={handleChange} onBlur={handleBlur} />
                <Error>{touched.email && errors.email ? touched.email && errors.email : null}</Error>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" onChange={handleChange} onBlur={handleBlur} />
                <Error>{touched.password && errors.password ? touched.password && errors.password : null}</Error>
              </div>
              <InnerForm setFormState={setFormState} />
            </form>
          )}
        </Formik>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button disabled={formState.isSubmitting || !formState.isValid} type="button" onClick={() => formState.submitForm()} >{formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Login</Button>
      </CardFooter>
    </Card>
  )
}