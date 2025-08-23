'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingViewProps {
  message: string;
}

export default function LoadingView({ message }: LoadingViewProps) {
  return (
    <Card className="shadow-lg w-full max-w-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
