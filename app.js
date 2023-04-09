// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser') // 引用 body-parser
const RecordedURL = require("./models/recordedURL")
const shortenURL = require("./shortenURL")
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/show', (req, res) => {
  const original_URL = req.body.original_URL
  if (original_URL.trim() === '') {
    return res.render('index', { error: 'Please enter valid URL' }) //若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
  } else {
    RecordedURL.findOne({ original_URL: original_URL }).lean()
      .then((url) => {
        if (url) { //輸入相同網址時，產生一樣的縮址。
        return res.render('show', { url })
      } else {
        const short_URL = shortenURL()
        RecordedURL.create({ original_URL, short_URL })
          .then((recordedURL) => {
            const id = recordedURL._id;
            return RecordedURL.findById(id)
          .lean()
          .then(url => res.render('show', { url }))
          })
        }
      })
      .catch(error => console.log(error))
    }
  }
)


app.get('/:id', (req, res) => {
  const id = req.params.id
  RecordedURL.findOne({short_URL: `localhost:3000/${id}`})
  .lean()
  .then(url => res.redirect(url.original_URL))
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})