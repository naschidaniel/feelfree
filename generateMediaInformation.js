const fs = require('fs')
const glob = require('glob')

const mediaJson = './static/media.json'

let dataMediaJson = {}
if (fs.existsSync('./static/media.json')) {
  dataMediaJson = JSON.parse(fs.readFileSync(mediaJson))
}

const images = glob.sync('./static/media/**/*.{jpg,png}')

images
  .sort()
  .map((filePath) => {
    const url = filePath.replace('./static', '')
    const file = filePath.split('/').reverse()[0]
    const path = filePath.replace('./static', '').replace(file, '')
    return { url, path, file, alt: '', title: '' }
  })
  .forEach((img) => {
    if (Object.keys(dataMediaJson).includes(img.url)) return
    dataMediaJson[img.url] = img
  })

const dataSorted = Object.keys(dataMediaJson)
  .filter((o) => {
    return images.includes(`./static${o}`)
  })
  .sort()
  .reduce((obj, key) => {
    obj[key] = dataMediaJson[key]
    return obj
  }, {})

const json = JSON.stringify(dataSorted, null, 2)
fs.writeFile(mediaJson, json, (err) => {
  if (err) throw err
})