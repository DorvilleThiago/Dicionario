import { xml2js } from 'xml-js';

export const convertXmlToObject = (xml: null | string) => {
  if (typeof xml === 'string') {
    const options = { ignoreComment: true, alwaysChildren: true };
    const result = xml2js(xml, options);
    const xmldesc = result.elements[0].elements[1].elements[1].elements[0].text;
    return xmldesc;
  } else {
    return null;
  }
}