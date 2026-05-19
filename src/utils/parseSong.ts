import { parseLine } from "./parseLine";
import type { SongDocument } from "../types/music";
import { detectSectionType } from "./detectSectionType";

export function parseSong(content: string): SongDocument {
  const lines = content.trim().split("\n");

  const parsedLines = lines.map((line) => parseLine(line));

  return {
    sections: [
      {
        type: "verse",
        lines: parsedLines,
      },
    ],
  };
}
