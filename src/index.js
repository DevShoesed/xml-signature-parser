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
  let workbook = new Excel.Workbook()
  let worksheet = workbook.addWorksheet('Segnatues')

  const subdirs = fse.readdirSync(options.directory)
  subdirs.forEach((file) => {
    const segnaturaObj = parseFile.getSegnaturaObj(
      `${options.directory}/${file}/Segnatura.xml`
    )

    worksheet.addRow({})
  })
} catch (error) {
  console.error(error.message)
}
