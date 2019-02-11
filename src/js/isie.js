/* Sample function that returns boolean in case the browser is Internet Explorer */
function isIE() {
  const ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones */
  const isIe = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

  return isIe;
}
