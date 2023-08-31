"use client";

import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode_toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Squeeze as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();
    const { auth } = useFirebase();
    const [isOpen, setOpen] = useState<boolean>(false);

    const renderRoute = (route: string, label: string) => <Button variant="ghost" className={` dark:hover:!text-gray-300 hover:!text-gray-700 !bg-transparent ${location.pathname.includes(route) ? 'dark:!text-white !text-black' : '!text-gray-500'}`} onClick={() => router.push(route)}>{label}</Button>

    const renderRoutes = () => {
        return <>
            {renderRoute("/builder", "Bot Builder")}
        </>
    }

    // close nav when route changes
    useEffect(() => {
        setOpen(false);
    }, [router.pathname]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => setOpen(open)}>
            <nav className={`${styles.nav} bg-card border-b`}>
                <div className={`page-width flex justify-between items-center`}>
                    <div className="flex justify-center items-center gap-1">
                        {/* Mobile hamburger menu icon, hidden on desktop */}
                        <div className="md:hidden flex items-center">
                            <SheetTrigger asChild>
                                <button type="button" className="mr-3">
                                    <Hamburger toggled={isOpen} toggle={setOpen} direction="right" size={22} />
                                </button>
                            </SheetTrigger>
                        </div>

                        {/* Logo that links to /app */}
                        <Link href={"/"} className="flex items-center gap-3 mr-4">
                            <img src={"/images/logo.png"} alt="Logo" className={`${styles.logo}`} />
                            <h5 className="font-extrabold">{process.env.NEXT_PUBLIC_APP_NAME}</h5>
                        </Link>
                        {/* Show on medium display, hidden on mobile */}
                        <div className="items-center gap-1 hidden md:flex">
                            {renderRoutes()}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />

                        {/* Dropdown Avatar component */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="rounded-full transition p-[0.1rem] bg-transparent hover:bg-[#0966D6]">
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push("/settings")}>
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={async () => {
                                    await signOut(auth);
                                    router.push("/");
                                }}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>

            <SheetContent side={"left"} className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>
                        <Link href={"/"} className="flex items-center gap-3 mr-4">
                            <img src={"/images/logo.png"} alt="Logo" className={`${styles.logo}`} />
                            <h5 className="font-extrabold">{process.env.NEXT_PUBLIC_APP_NAME}</h5>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col flex-grow py-4 items-start">
                    {renderRoutes()}
                </div>
                <SheetFooter className="sticky bottom-0 left-0">
                    <small className="text-xs dark:text-gray-400">© 2023, MyGPT Created by Colby McHenry</small>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}