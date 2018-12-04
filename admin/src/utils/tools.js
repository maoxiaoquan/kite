export function isEmpty (obj) {
  var key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false
    }
  }
  return true
}