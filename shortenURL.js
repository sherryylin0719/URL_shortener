// define sample function to randomly return an item in an array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function shortenURL() {
  const library = 'abcdefghijklmnopqrstuvwxyz1234567890'
  const libraryArray = library.split('')
  let short_URL = "localhost:3000/"
  for (let i = 0; i < 5; i++) {
    short_URL += sample(libraryArray)
  }
  return short_URL
}

module.exports = shortenURL