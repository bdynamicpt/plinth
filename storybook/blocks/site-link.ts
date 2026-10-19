/** A component's page on the website, from its stories' title: "Components/Icon button" is /components/icon-button. */
export function siteUrl(title: string): string | null {
  const match = /^Components\/(.+)$/.exec(title);
  return match ? `/components/${match[1]!.toLowerCase().replace(/\s+/g, '-')}` : null;
}
