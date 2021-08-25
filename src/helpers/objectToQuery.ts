export default (object: { [key: string]: any }) => {
  const qs = Object.keys(object)
    .map(key => `${key}=${object[key]}`)
    .join('&')
  
  // if object and querystring are empty return empty string
  return qs ? '?'.concat(qs) : ''; 
}