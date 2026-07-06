export type Setlist = {
  id: string;
  name: string;
  date?: string;
  songIds: string[];
  // Quando este repertório é uma cópia salva de um link compartilhado,
  // guarda o id do repertório original (para deduplicar novas aberturas).
  sourceId?: string;
};
