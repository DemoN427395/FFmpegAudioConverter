const { app, BrowserWindow, ipcMain, session, dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const ffmpegStatic = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const archiver = require('archiver')

ffmpeg.setFfmpegPath(ffmpegStatic)
console.log(ffmpeg.setFfmpegPath(ffmpegStatic))

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']=true

let convertedFiles = []
let archiveName

const directoryMP3 = path.join(__dirname, '/tmp/mp3')
const directoryOGG = path.join(__dirname, '/tmp/ogg')
const directoryWAV = path.join(__dirname, '/tmp/wav')

const directoryMP3Archive = path.join(__dirname, 'tmp', 'ArchiveMP3.zip')
const directoryOGGArchive = path.join(__dirname, 'tmp', 'ArchiveOGG.zip')
const directoryWAVArchive = path.join(__dirname, 'tmp', 'ArchiveWAV.zip')

let optionsZip = {
  title: 'Save file - Electron example',

  buttonLabel: 'Save',

  filters: [{ name: 'zip', extensions: ['zip'] }],

  properties: ['createDirectory']
}

async function deleteDirectory(directory, archiveDirectory) {
  await fsExtra.emptyDir(directory, (err) => {
    console.error(err)
  })
  if (fs.existsSync(archiveDirectory)) {
    await fs.promises.unlink(archiveDirectory, (err) => {
      console.error(err)
    })
  }
}

function saveDialog(filename) {
  const savePath = dialog.showSaveDialogSync(optionsZip);

  if (savePath) {
    try {
      fs.copyFileSync(filename, savePath);
      console.log('Archive was successfully saved to:', savePath);
    } catch (err) {
      console.error('Failed to save the archive:', err);
    }
  } else {
    console.log('The save dialog was cancelled');
  }

}

ipcMain.on('convert-audio-mp3', (event, filePaths) => {
  if (!Array.isArray(filePaths)) {
    console.error('filePaths is not an array')
    return
  }
  deleteDirectory(directoryMP3, directoryMP3Archive)
  convertedFiles.splice(0, convertedFiles.length)

  archiveName = 'ArchiveMP3.zip'
  archiveName = archiveName

  optionsZip.defaultPath = app.getPath('music') + '/' + archiveName

  let processedFiles = 0
  const totalFiles = filePaths.length

  filePaths.forEach((filePath, index) => {
    let fileName = path.basename(filePath)
    fileName = fileName.substring(0, fileName.lastIndexOf('.'))

    ffmpeg(filePath)
      .toFormat('mp3')
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message)
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.targetSize + ' KB converted')
      })
      .on('end', () => {
        console.log('Processing finished !')
        convertedFiles.push(`./tmp/mp3/${fileName}.mp3`)
        console.log(convertedFiles)

        processedFiles++
        if (processedFiles === totalFiles) {
          let archive = archiver('zip', {
            zlib: { level: 9 },
          })

          const output = fs.createWriteStream(`./tmp/${archiveName}`)
          archive.pipe(output)

          convertedFiles.forEach((file) => {
            archive.append(fs.createReadStream(file), {
              name: path.basename(file),
            })
          })

          output.on('close', function () {
            console.log(archive.pointer() + ' total bytes')
            console.log(
              'Archiver has been finalized and the output file descriptor has closed.'
            )
            saveDialog(directoryMP3Archive)
          })

          archive.on('error', function (err) {
            throw err
          })

          archive.finalize()
        }
      })
      .save(`./tmp/mp3/${fileName}.mp3`)
  })
})

ipcMain.on('convert-audio-ogg', (event, filePaths) => {
  if (!Array.isArray(filePaths)) {
    console.error('filePaths is not an array')
    return
  }
  deleteDirectory(directoryOGG, directoryOGGArchive)
  convertedFiles.splice(0, convertedFiles.length)

  archiveName = 'ArchiveOGG.zip'
  archiveName = archiveName

  optionsZip.defaultPath = app.getPath('music') + '/' + archiveName

  let processedFiles = 0
  const totalFiles = filePaths.length

  filePaths.forEach((filePath, index) => {
    let fileName = path.basename(filePath)
    fileName = fileName.substring(0, fileName.lastIndexOf('.'))

    ffmpeg(filePath)
      .toFormat('ogg')
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message)
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.targetSize + ' KB converted')
      })
      .on('end', () => {
        console.log('Processing finished !')
        convertedFiles.push(`./tmp/ogg/${fileName}.ogg`)
        console.log(convertedFiles)

        processedFiles++
        if (processedFiles === totalFiles) {
          let archive = archiver('zip', {
            zlib: { level: 9 },
          })

          const output = fs.createWriteStream(`./tmp/${archiveName}`)
          archive.pipe(output)

          convertedFiles.forEach((file) => {
            archive.append(fs.createReadStream(file), {
              name: path.basename(file),
            })
          })

          output.on('close', function () {
            console.log(archive.pointer() + ' total bytes')
            console.log(
              'Archiver has been finalized and the output file descriptor has closed.'
            )
            saveDialog(directoryOGGArchive)
          })

          archive.on('error', function (err) {
            throw err
          })

          archive.finalize()
        }
      })
      .save(`./tmp/ogg/${fileName}.ogg`)
  })
})

ipcMain.on('convert-audio-wav', (event, filePaths) => {
  if (!Array.isArray(filePaths)) {
    console.error('filePaths is not an array')
    return
  }
  deleteDirectory(directoryWAV, directoryWAVArchive)
  convertedFiles.splice(0, convertedFiles.length)

  archiveName = 'ArchiveWAV.zip'
  archiveName = archiveName

  optionsZip.defaultPath = app.getPath('music') + '/' + archiveName

  let processedFiles = 0
  const totalFiles = filePaths.length

  filePaths.forEach((filePath, index) => {
    let fileName = path.basename(filePath)
    fileName = fileName.substring(0, fileName.lastIndexOf('.'))

    ffmpeg(filePath)
      .toFormat('wav')
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message)
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.targetSize + ' KB converted')
      })
      .on('end', () => {
        console.log('Processing finished !')
        convertedFiles.push(`./tmp/wav/${fileName}.wav`)
        console.log(convertedFiles)

        processedFiles++
        if (processedFiles === totalFiles) {
          let archive = archiver('zip', {
            zlib: { level: 9 },
          })

          const output = fs.createWriteStream(`./tmp/${archiveName}`)
          archive.pipe(output)

          convertedFiles.forEach((file) => {
            archive.append(fs.createReadStream(file), {
              name: path.basename(file),
            })
          })

          output.on('close', function () {
            console.log(archive.pointer() + ' total bytes')
            console.log(
              'Archiver has been finalized and the output file descriptor has closed.'
            )
            saveDialog(directoryWAVArchive)
          })

          archive.on('error', function (err) {
            throw err
          })

          archive.finalize()
        }
      })
      .save(`./tmp/wav/${fileName}.wav`)
  })
})

ipcMain.handle('read-file', async (event, filename) => {
  return new Promise((resolve, reject) => {
    let result = ''
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      terminal: false,
    })

    rl.on('line', (line) => {
      result += line + '\n'
    })

    rl.on('close', () => {
      resolve(result)
    })

    rl.on('error', (err) => {
      reject(err)
    })
  })
})

app.on('ready', () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; media-src 'self' blob: data: mediastream:;",
        ],
      },
    })
  })
})

function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    resizable: false,
    icon: __dirname + '/icon.ico',
    requestedExecutionLevel: 'requireAdministrator',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.setMenuBarVisibility(false)
  win.loadFile('converter/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
