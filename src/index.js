// import yargs from 'yargs'
// import fse from 'fs-extra'
// import parseFile from './parseFile/index.js'
// import Excel from 'exceljs'

const yargs = require('yargs')
const fse = require('fs-extra')
const parseFile = require('./parseFile/index.js')
const Excel = require('exceljs')

const options = yargs.usage('Usage: -d <directory>').option('d', {
  alias: 'directory',
  describe: 'Path where are file',
  type: 'string',
  demandOption: true,
}).argv

try {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Segnatues')

  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Numero', key: 'numero', width: 32 },
    { header: 'Anno', key: 'anno', width: 32 },
    { header: 'Tipo', key: 'tipo', width: 5 },
    { header: 'Documento', key: 'documento', width: 150 },
  ]

  const subdirs = fse.readdirSync(options.directory)

  const fileName = `${options.directory.split('/').pop()}.xlsx`

  subdirs.forEach((file) => {
    const segnaturaObj = parseFile.getSegnaturaObj(
      `${options.directory}/${file}/Segnatura.xml`
    )

    if (
      segnaturaObj &&
      segnaturaObj.Segnatura &&
      segnaturaObj.Segnatura.Intestazione &&
      segnaturaObj.Segnatura.Intestazione.Identificatore &&
      segnaturaObj.Segnatura.Intestazione.Identificatore.NumeroRegistrazione &&
      segnaturaObj.Segnatura.Intestazione.Identificatore.DataRegistrazione &&
      segnaturaObj.Segnatura.Descrizione.Documento
    ) {
      const row = {
        id: file,
        numero:
          segnaturaObj.Segnatura.Intestazione.Identificatore
            .NumeroRegistrazione,
        anno: new Date(
          segnaturaObj.Segnatura.Intestazione.Identificatore.DataRegistrazione
        ).getFullYear(),
        tipo: 'doc',
        documento: segnaturaObj.Segnatura.Descrizione.Documento.attr['@_nome'],
      }

      worksheet.addRow(row)

      if (segnaturaObj.Segnatura.Descrizione.Allegati) {
        const doc = segnaturaObj.Segnatura.Descrizione.Allegati.Documento
        const documento = Array.isArray(doc) ? doc : [doc]

        documento.forEach((allegato) => {
          worksheet.addRow({
            id: row.id,
            numero: row.numero,
            anno: row.anno,
            tipo: 'all',
            documento: allegato.attr['@_nome'],
          })
        })
      }
    }
  })

  workbook.xlsx
    .writeFile(fileName)
    .then(() => {
      console.log(`${fileName} saved`)
    })
    .catch((err) => {
      console.log('err', err)
    })
} catch (error) {
  console.error(error.message)
}
