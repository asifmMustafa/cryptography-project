"use client";

import { useState, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TwoByTwoMatrix, hillEncrypt, hillDecrypt } from "@/lib/crypto";
import { ErrorBox } from "./ErrorBox";
import { ResultBox } from "./ResultBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isFiniteInteger, parseIntStrict } from "@/lib/utils";

type HillKeyMode = "string" | "matrix";

const HillPanel = () => {
  const [mode, setMode] = useState<HillKeyMode>("string");

  const [keyString, setKeyString] = useState("HILL");
  const [m00, setM00] = useState("7");
  const [m01, setM01] = useState("8");
  const [m10, setM10] = useState("11");
  const [m11, setM11] = useState("11");

  const [text, setText] = useState("short example");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  const keyInput = useMemo(() => {
    if (mode === "string") return keyString;

    const a = parseIntStrict(m00);
    const b = parseIntStrict(m01);
    const c = parseIntStrict(m10);
    const d = parseIntStrict(m11);

    const matrix: TwoByTwoMatrix = [
      [a, b],
      [c, d],
    ];

    return matrix;
  }, [mode, keyString, m00, m01, m10, m11]);

  const validateMatrixInputs = (): string | null => {
    if (mode !== "matrix") return null;

    const nums = [m00, m01, m10, m11].map(parseIntStrict);
    if (!nums.every(isFiniteInteger))
      return "Hill matrix entries must be integers.";
    return null;
  };

  const validateStringKey = (): string | null => {
    if (mode !== "string") return null;
    const compact = keyString.replace(/\s+/g, "");
    if (compact.length !== 4)
      return "Hill string key must be exactly 4 letters (e.g., HILL).";
    if (!/^[A-Za-z]{4}$/.test(compact))
      return "Hill string key must contain letters only (A–Z).";
    return null;
  };

  const run = (op: "encrypt" | "decrypt") => {
    setError(null);

    const mErr = validateMatrixInputs();
    if (mErr) {
      setError(mErr);
      return;
    }

    const sErr = validateStringKey();
    if (sErr) {
      setError(sErr);
      return;
    }

    try {
      const out =
        op === "encrypt"
          ? hillEncrypt(text, keyInput as any)
          : hillDecrypt(text, keyInput as any);
      setResult(out);
    } catch (e: any) {
      setError(e?.message ?? "Unexpected error.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hill Cipher (2×2, mod 26)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Key Format</Label>
          <Select value={mode} onValueChange={(v) => setMode(v as HillKeyMode)}>
            <SelectTrigger className="w-full sm:w-[260px]">
              <SelectValue placeholder="Select key type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String (4 letters)</SelectItem>
              <SelectItem value="matrix">Matrix (2×2 integers)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "string" ? (
          <div className="grid gap-2">
            <Label htmlFor="hill-key-string">Key (4 letters)</Label>
            <Input
              id="hill-key-string"
              value={keyString}
              onChange={(e) => setKeyString(e.target.value)}
              placeholder="HILL"
            />
            <p className="text-xs text-muted-foreground">
              Mapped A→0 … Z→25 in row-major order.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Key Matrix</Label>
            <div className="grid gap-3 sm:grid-cols-4">
              <Input
                value={m00}
                onChange={(e) => setM00(e.target.value)}
                placeholder="a"
              />
              <Input
                value={m01}
                onChange={(e) => setM01(e.target.value)}
                placeholder="b"
              />
              <Input
                value={m10}
                onChange={(e) => setM10(e.target.value)}
                placeholder="c"
              />
              <Input
                value={m11}
                onChange={(e) => setM11(e.target.value)}
                placeholder="d"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Matrix is [[a,b],[c,d]]. Determinant must be invertible mod 26.
            </p>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="hill-text">Text</Label>
          <Textarea
            id="hill-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your Hill implementation normalizes to letters-only uppercase for
            encryption/decryption output.
          </p>
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

export { HillPanel };
