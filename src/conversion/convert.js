export default function convert(jsonFile) {
  const jsonObject = JSON.parse(jsonFile);
  return JSON.stringify(convertObject(jsonObject))
}

export function convertObject(jsonObject) {
  const convertedJsonObject = Object.assign({}, jsonObject);
  if (jsonObject.display == "none") {
    convertedJsonObject.display = undefined;
  } else {
    convertedJsonObject.display = "none";
  }

  convertedJsonObject.children = jsonObject.children.map(convertObject)

  return convertedJsonObject
}	  
