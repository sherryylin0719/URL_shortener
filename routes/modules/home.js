// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const RecordedURL = require("../../models/recordedURL")
const shortenURL = require("../../shortenURL")

// 設定首頁路由
router.get('/', (req, res) => {
  res.render('index')
})

router.post('/show', (req, res) => {
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
          .then(recordedURL => res.render('show', { url: recordedURL}))
        }
      })
      .catch(error => console.log(error))
    }
  }
)

router.get('/:id', (req, res) => {
  const id = req.params.id
  RecordedURL.findOne({short_URL: `localhost:3000/${id}`})
  .lean()
  .then(url => res.redirect(url.original_URL))
})

// 匯出路由器
module.exports = router