export async function fetchDkimData(dkimDomain: string, dkimSelector: string) {
  const response = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${dkimSelector}._domainkey.${dkimDomain}&type=TXT`,
    { method: "GET", headers: { Accept: "application/dns-json" } }
  );
  const data: DnsQuery = await response.json();

  const dkimUnparsedData = data.Answer?.[0].data;
  const dkimDataValues = dkimUnparsedData?.replace(/\"/g, "").split(";");

  const dkimData = dkimDataValues?.reduce((previousValue, currentValue) => {
    const [key, value] = currentValue.split("=");
    previousValue[key.trim()] = value.trim();
    return previousValue;
  }, {} as Dictionary);

  return dkimData;
}
