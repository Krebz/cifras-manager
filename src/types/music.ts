export type Token = {
  type: "chord" | "text";
  value: string;
};

export type ParsedLine = {
  raw: string;
  tokens: Token[];
};

export type SongDocument = {
  lines: ParsedLine[];
};
