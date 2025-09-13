import { Import, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ChangeEvent } from "react";

interface WelcomeStepProps {
    setAppState: any;
    importFileInputRef: React.RefObject<HTMLInputElement>;
    handleImport: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function WelcomeStep({ setAppState, importFileInputRef, handleImport }: WelcomeStepProps) {
    return (
        <Card className="shadow-lg w-full max-w-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl">Nice to meet you</CardTitle>
                <CardDescription>Click on the bellow button to create a professional resume in minutes.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button onClick={() => setAppState({ step: 'template' })} variant="default" size="lg">
                    <Pencil className="mr-2" /> Start From Scratch
                </Button>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <p className="text-sm text-muted-foreground">Have a saved session?</p>
                <Button onClick={() => importFileInputRef.current?.click()} variant="link" className="p-0 h-auto">
                    <Import className="mr-2" /> Import from JSON
                </Button>
                <input type="file" ref={importFileInputRef} onChange={handleImport} accept=".json" className="hidden" />
            </CardFooter>
        </Card>
    );
}
