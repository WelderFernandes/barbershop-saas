/**
 * Transforma uma string em um slug legível para URL.
 * Remove acentos, caracteres especiais, espaços duplos e converte para minúsculas.
 * Ex: "Barbearia do João & Cia ✨" -> "barbearia-do-joao-cia"
 * 
 * @param text O texto a ser transformado
 * @returns O slug gerado
 */
export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFD")                   // Decompõe caracteres acentuados (ex: ã -> a + ~)
    .replace(/[\u0300-\u036f]/g, "")     // Remove os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")                // Substitui espaços por hifens (-)
    .replace(/[^\w-]+/g, "")             // Remove caracteres que não sejam palavras ou hifens
    .replace(/--+/g, "-")                // Remove hifens duplicados
    .replace(/^-+/, "")                  // Remove hifens no início
    .replace(/-+$/, "");                 // Remove hifens no final
}
