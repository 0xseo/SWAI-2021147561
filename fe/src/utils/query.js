export function parceQuery(word) {
  var queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const res = urlParams.get(word);
  return res;
}
