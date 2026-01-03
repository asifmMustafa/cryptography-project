"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

const ResultBox = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="py-0">
        <CardTitle className="text-base">Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={value} readOnly className="min-h-[120px]" />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopy} disabled={!value}>
            {copied ? (
              <>
                <Check />
                Copied!
              </>
            ) : (
              <>
                <Copy />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ResultBox };
