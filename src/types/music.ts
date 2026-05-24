export type ChordToken = {
  type: "chord";
  value: ChordData;
  position: number;
};

export type TextToken = {
  type: "text";
  value: string;
  position: number;
};

export type DirectiveToken = {
  type: "directive";
  value: string;
  position: number;
};

export type Token =
  | ChordToken
  | TextToken
  | DirectiveToken;

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

export type ChordData = {
  root: string;
  suffix: string;
  bass?: string;
}

export type MusicalChunk = {
  chord?: ChordData;
  lyric: string;
};