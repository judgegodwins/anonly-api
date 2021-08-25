
export default function (str: string): string {
  str = str.toLowerCase();

  const strArr = str.split('');
  
  for (let i = 0; i < strArr.length; i++) {

    if (strArr[i] === ' ' || strArr[i] === '_') {
      if (i !== strArr.length-1) {
        strArr[i+1] = strArr[i+1].toUpperCase();
      }
      strArr.splice(i, 1);
    }
  }
  return strArr.join('');
}