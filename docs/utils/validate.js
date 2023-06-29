export function isValidDomain(domain) {
  if (!domain) return true;
  const regex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/;
  return regex.test(domain);
}

export function isValidEmail(email) {
  if (!email) return true;
  const regex = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;
  return regex.test(email);
}