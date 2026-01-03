"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { affineEncrypt, affineDecrypt } from "@/lib/crypto";
import { ErrorBox } from "./ErrorBox";
import { ResultBox } from "./ResultBox";
import { isFiniteInteger, parseIntStrict } from "@/lib/utils";
import type { AffineKey } from "@/lib/crypto";

const AffinePanel = () => {
  const [a, setA] = useState("17");
  const [b, setB] = useState("20");
  const [text, setText] = useState("AFFINE CIPHER");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = (mode: "encrypt" | "decrypt") => {
    setError(null);

    const aNum = parseIntStrict(a);
    const bNum = parseIntStrict(b);

    if (!isFiniteInteger(aNum) || !isFiniteInteger(bNum)) {
      setError(
        "Affine key values a and b must be integers (e.g., a=17, b=20)."
      );
      return;
    }

    const key: AffineKey = { a: aNum, b: bNum };

    try {
      const out =
        mode === "encrypt"
          ? affineEncrypt(text, key)
          : affineDecrypt(text, key);
      setResult(out);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affine Cipher</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="affine-a">
              a{" "}
              <p className="text-xs text-muted-foreground">
                Must be coprime with 26
              </p>
            </Label>
            <Input
              id="affine-a"
              value={a}
              onChange={(e) => setA(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="affine-b">b</Label>
            <Input
              id="affine-b"
              value={b}
              onChange={(e) => setB(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="affine-text">Text</Label>
          <Textarea
            id="affine-text"
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

export { AffinePanel };
