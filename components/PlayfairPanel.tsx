"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { playfairEncrypt, playfairDecrypt } from "@/lib/crypto";
import { ErrorBox } from "./ErrorBox";
import { ResultBox } from "./ResultBox";

const PlayfairPanel = () => {
  const [key, setKey] = useState("MONARCHY");
  const [text, setText] = useState("instrumentsx");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (mode: "encrypt" | "decrypt") => {
    setError(null);

    // If you applied the earlier “no punctuation in key” patch, this check aligns with it.
    const compact = key.replace(/\s+/g, "");
    if (!compact) {
      setError("Playfair key must not be empty.");
      return;
    }
    if (!/^[A-Za-z]+$/.test(compact)) {
      setError("Playfair key must contain letters only (A–Z).");
      return;
    }

    try {
      const out =
        mode === "encrypt"
          ? playfairEncrypt(text, key)
          : playfairDecrypt(text, key);
      setResult(out);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playfair Cipher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="playfair-key">Key (letters only)</Label>
          <Input
            id="playfair-key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            J is merged into I by normalization.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="playfair-text">Text</Label>
          <Textarea
            id="playfair-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => run("encrypt")}>Encrypt</Button>
          <Button variant="secondary" onClick={() => run("decrypt")}>
            Decrypt
          </Button>
          <Button variant="outline" onClick={() => setResult("")}>
            Clear Result
          </Button>
        </div>

        {error ? <ErrorBox message={error} /> : null}
        <ResultBox value={result} />
      </CardContent>
    </Card>
  );
};

export { PlayfairPanel };
