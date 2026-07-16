export function getValueByKey(obj, key) {
  if (obj === null || obj === undefined) {
    return '' // or return any default value you prefer
  }

  const keys = key.split('.') // Split the key by dots to get individual properties

  let value = obj
  for (const k of keys) {
    value = value[k] // Traverse the object using each key
    if (value === undefined) {
      return '' // If any key is undefined, return undefined
    }

    if (value === null) {
      return ''
    }
  }

  return value
}
