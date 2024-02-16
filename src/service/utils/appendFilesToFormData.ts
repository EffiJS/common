export function appendFilesToFormData(data, formData, key = '') {
  // if (!key) {
  //   return mapObject(data, formData);
  // }

  if (Array.isArray(data)) {
    return data.map((d, i) => appendFilesToFormData(d, formData, `${key}[${i}]`));
  } else if (typeof data === 'object' && data instanceof Date) {
    return data.toISOString();
  } else if (typeof data === 'object' && data !== null) {
    if (isFile(data)) {
      addToFormData(formData, data, key);
      return key;
    } else {
      return mapObject(data, formData, key);
    }
  } else {
    return data;
  }
}

function mapObject(data, formData, key) {
  const res = {};
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      res[k] = appendFilesToFormData(data[k], formData, key ? `${key}.${k}` : k);
    }
  }
  return res;
}

function isFile(value) {
  return typeof value === 'object' && value && value.uri && value.type && true;
}

function addToFormData(formData, value, formDataKey) {
  formData.append(
    formDataKey,
    value || {
      uri: value.uri,
      name: value.fileName || value.name,
      type: value.type,
    },
  );
}
