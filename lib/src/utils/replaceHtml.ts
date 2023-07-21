export function replaceHtml(template: string, dictionary: { [key: string]: string | number }): string {
  let htmlFilled = template;
  for (const key in dictionary) {
    const value = String(dictionary[key]);
    htmlFilled = htmlFilled.replaceAll(key, value);
  }
  return htmlFilled;
}
