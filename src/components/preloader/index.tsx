"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useFirebase } from "@/contexts/FirebaseContext";

export default function PreLoader() {

    const [hidden, setHidden] = useState<boolean>(false);
    const progressBar = useRef<HTMLDivElement>(null);

    const firebase = useFirebase();

    useEffect(() => {
        if (firebase.firebase) {

        }
    }, [firebase.firebase]);

    function allImagesLoaded(callback: () => void) {
        // var images = Array.from(document.querySelectorAll('img')).filter((img) => img.src !== undefined && img.getBoundingClientRect().top < window.innerHeight);
        var images = Array.from(document.querySelectorAll('img')).filter((img) => img.src !== undefined);
        var loadedImages = 0;

        function imageLoaded() {
            loadedImages++;
            let goal = images.length;
            let progress = (loadedImages / goal) * 100;

            if (progressBar.current) {
                progressBar.current.style.width = `${progress}vw`;
            }

            if (loadedImages >= goal) {
                callback();
            }
        }

        for (var i = 0; i < images.length; i++) {
            const image = new Image();
            image.onload = image.onerror = imageLoaded;
            image.src = images[i].src;
            if (image.complete) {
                imageLoaded();
            }
            // images[i].addEventListener('canplaythrough', imageLoaded);
        }
    }

    // Usage
    allImagesLoaded(function () {
        // Your code to run after all images have loaded
        setHidden(true);
        document.body.classList.add('loaded');
    });

    return (
        <div className={styles.loader + (hidden ? ' ' + styles.hide : '')}>
            <div ref={progressBar} className={styles.progressBar}>
                <div></div>
            </div>
            <img src={'/images/logo.png'} loading="eager" width="100%" height="100%" />
        </div>
    );
}