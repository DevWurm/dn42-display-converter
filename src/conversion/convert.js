import CIDR from 'cidr-js';

export default function convert(prefixesData, metadataData) {
  const prefixesObject = JSON.parse(prefixesData);
  const metadataObject = JSON.parse(metadataData);

  return convertObjects(prefixesObject, metadataObject).map(JSON.stringify);
}

export function convertObjects(prefixesObject, metadataObject, parentPrefix) {
  const convertedPrefixesObject = Object.assign({}, prefixesObject);
  const convertedMetadataObject = Object.assign({}, metadataObject);
  const currentPrefix = prefixesObject.prefix
  const currentRange = (new CIDR()).range(currentPrefix);

  if (prefixesObject.display == "none") {
    convertedPrefixesObject.display = undefined;
    if (parentPrefix && currentPrefix) {
      convertedMetadataObject[currentPrefix] = metadataObject[parentPrefix];
      convertedMetadataObject[currentPrefix].cidr = currentPrefix;
      convertedMetadataObject[currentPrefix].inetnum = [currentRange.start + ' - ' + currentRange.end];
      convertedMetadataObject[currentPrefix].desc = ["An available network"];
      convertedMetadataObject[currentPrefix].status = ["AVAILABLE"];
    }
  } else {
    convertedPrefixesObject.display = "none";
  }

  convertedPrefixesObject.children = prefixesObject.children.map(child => {
    const [childPrefixesObject, childMetadataObject] = convertObjects(child, convertedMetadataObject, currentPrefix);
    Object.assign(convertedMetadataObject, childMetadataObject);
    return childPrefixesObject;
  });

  return [convertedPrefixesObject, convertedMetadataObject];  
}	  
