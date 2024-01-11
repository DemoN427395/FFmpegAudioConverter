window.onload = function () {
  var myfiles = []
  $('#buttonChooseFile').click(function () {
    $('<input type="file" multiple accept=".mp3,.wav,.ogg,.aac">')
      .on('change', function () {
        myfiles = this.files //save selected files to the array

        console.log(myfiles)
        let fileNames = Array.from(myfiles)
          .map((file) => `<li>${file.name}</li>`)
          .join('')
        document.querySelector('ul').innerHTML = fileNames
      })
      .click()
  })

  $('#buttonConvert').click(function (event) {
    event.preventDefault()
  })

  $('#buttonMP3').click(function (event) {
    event.preventDefault();
    let filePaths = Array.from(myfiles).map(file => file.path);
    window.electron.ipcRenderer.send('convert-audio-mp3', filePaths);
  });

  $('#buttonOGG').click(function (event) {
    event.preventDefault();
    let filePaths = Array.from(myfiles).map(file => file.path);
    window.electron.ipcRenderer.send('convert-audio-ogg', filePaths);
  })

  $('#buttonWAV').click(function (event) {
    event.preventDefault();
    let filePaths = Array.from(myfiles).map(file => file.path);
    window.electron.ipcRenderer.send('convert-audio-wav', filePaths);
  })

  
  $(document).ready(function () {
    let click = false
    $('.buttonsType').hide()
    $('.container').on('click', function () {
      if (click) {
        $('.buttonsType').stop().fadeIn(400)
      } else {
        $('.buttonsType').stop().fadeOut(400)
      }
      click = !click
    })
  })
}
