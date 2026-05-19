import { parseLine } from "./parseLine";
import type { SongDocument } from "../types/music";

export function parseSong(content: string): SongDocument {
  const lines = content.trim().split("\n");

  return {
    sections: [
      {
        type: "verse",
        lines: lines.map((line) => parseLine(line)),
      },
    ],
  };
}
