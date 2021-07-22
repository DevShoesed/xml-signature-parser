import yargs from 'yargs'
import fse from 'fs-extra'

import parseFile from './parseFile/index.js'

import Excel from 'exceljs'

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
  ]

  const subdirs = fse.readdirSync(options.directory)

  subdirs.forEach(async (file) => {
    const segnaturaObj = parseFile.getSegnaturaObj(
      `${options.directory}/${file}/Segnatura.xml`
    )

    const row = {
      id: file,
      numero:
        segnaturaObj.Segnatura.Intestazione.Identificatore.NumeroRegistrazione,
      anno: new Date(
        segnaturaObj.Segnatura.Intestazione.Identificatore.DataRegistrazione
      ).getFullYear(),
    }

    if (segnaturaObj.Segnatura.Descrizione.Allegati) {
      //console.log(segnaturaObj.Segnatura.Descrizione.Allegati)
      Object(segnaturaObj.Segnatura.Descrizione.Allegati).forEach((all) => {
        console.log(all)
      })
      // var i = 1
      // segnaturaObj.Segnatura.Descrizione.Allegati.forEach(async (all) => {
      //   //row[`allegato${i}`] = all.
      //   console.log(all)
      //   i++
      // })
    }

    await worksheet.addRow(row)
  })

  await workbook.xlsx
    .writeFile('export.xlsx')
    .then(() => {
      console.log('saved')
    })
    .catch((err) => {
      console.log('err', err)
    })
} catch (error) {
  console.error(error.message)
}
