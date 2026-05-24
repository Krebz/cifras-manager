export type Token = {
  type: "chord" | "text" | "directive";
  value: string;
};

export type ParsedLine = {
  raw: string;
  tokens: Token[];
};

export type SectionType = "verse" | "chorus" | "bridge" | "intro" | "outro";

export type SongSection = {
  type: SectionType;
  lines: ParsedLine[];
};

export type SongDocument = {
  title: string;
  key: string;
  sections: SongSection[];
}