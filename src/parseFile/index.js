// import fse from 'fs-extra'
// import parser from 'fast-xml-parser'
// import he from 'he'

const fse = require('fs-extra')
const parser = require('fast-xml-parser')
const he = require('he')

const xmlOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  attrValueProcessor: (val, attrName) =>
    he.decode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  stopNodes: ['pa'],
}

const getSegnaturaObj = function (pathXmlFIle) {
  const xmlData = fse.readFileSync(pathXmlFIle)
  const jsonObj = parser.parse(xmlData.toString(), xmlOptions)

  return jsonObj
}

module.exports = { getSegnaturaObj }
// export default { getSegnaturaObj }
