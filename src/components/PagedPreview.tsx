'use client';

import { useEffect, useRef, useState } from 'react';
import { Previewer } from 'pagedjs';

interface PagedPreviewProps {
    contentHtml: string;
    setPrintReadyHtml: (html: string) => void;
}

export default function PagedPreview({ contentHtml, setPrintReadyHtml }: PagedPreviewProps) {
    const previewRef = useRef(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!contentHtml || !previewRef.current) {
            setLoading(true);
            return;
        }

        setLoading(true);
        // Clear the preview area before rendering new content
        previewRef.current.innerHTML = '';

        const paged = new Previewer();

        paged.preview(contentHtml, ['templates/css/print.css'], previewRef.current)
            .then(flow => {
                console.log("Paged.js preview rendered successfully!");
                console.log("Total pages: ", flow.total);
                setLoading(false);
                setPrintReadyHtml(previewRef.current?.innerHTML || '');
            });

        // No cleanup function needed since we clear the container at the start of the effect
    }, [contentHtml]);

    return (
        <div ref={previewRef} className="resume-preview"/>
    );
}