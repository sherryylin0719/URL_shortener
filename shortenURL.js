// define sample function to randomly return an item in an array
function sample(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

function shortenURL() {
  const library = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9,0]
  let short_URL = localhost:3000/
  for (let i = 0; i < 5; i++) {
    short_URL += sample(library)
  }
  return short_URL
}

module.exports = shortenURL