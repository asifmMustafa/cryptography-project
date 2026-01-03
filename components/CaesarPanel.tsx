"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { caesarEncrypt, caesarDecrypt } from "@/lib/crypto";
import { ErrorBox } from "./ErrorBox";
import { ResultBox } from "./ResultBox";
import { isFiniteInteger, parseIntStrict } from "@/lib/utils";

const CaesarPanel = () => {
  const [shift, setShift] = useState("3");
  const [text, setText] = useState("Hello, World!");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (mode: "encrypt" | "decrypt") => {
    setError(null);

    const s = parseIntStrict(shift);
    if (!isFiniteInteger(s)) {
      setError("Shift must be an integer (e.g., 3).");
      return;
    }

    try {
      const out =
        mode === "encrypt" ? caesarEncrypt(text, s) : caesarDecrypt(text, s);
      setResult(out);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Caesar Cipher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="caesar-shift">Shift</Label>
          <Input
            id="caesar-shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="caesar-text">Text</Label>
          <Textarea
            id="caesar-text"
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

export { CaesarPanel };
