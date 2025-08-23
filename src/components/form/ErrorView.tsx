'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileWarning } from 'lucide-react';

interface ErrorViewProps {
  error: string | null;
  onTryAgain: () => void;
}

export default function ErrorView({ error, onTryAgain }: ErrorViewProps) {
  return (
    <Card className="shadow-lg max-w-lg w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileWarning className="h-5 w-5 text-destructive" />
          <CardTitle>Error</CardTitle>
        </div>
        <CardDescription className="text-destructive">
          {error}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onTryAgain} className="w-full">
          <RefreshCw className="mr-2" /> Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
