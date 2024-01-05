
const Scraper = require('..')
const express = require('express')
const app = express()
app.use(express.json()); // 用于解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true }));
const scraper = new Scraper()
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`<h1>server is running on: ${PORT}</h1>`)
})

app.post('/douyin', async (req, res) => {
    const url = req.body.url;
    try {
        const douyinId = await scraper.getDouyinVideoId(url);
        const douyinData = await scraper.getDouyinVideoData(douyinId);
        const douyinUrl = await scraper.getDouyinNoWatermarkVideo(douyinData);
        const imgUrl = await scraper.getDouyinImageUrls(douyinData)
        res.send({code: 0, data: { video: douyinUrl, img: imgUrl } })
    } catch (e) {
        res.send({code: 1, msg: String(e), data: null })
    }
})

app.post('/workflow', async (req, res) => {
    const url = req.body.url;
    try {
        const isHomeUrl = url.indexOf('查看TA的更多作品') !== -1
        if (!isHomeUrl) {
            const douyinId = await scraper.getDouyinVideoId(url);
            const douyinData = await scraper.getDouyinVideoData(douyinId);
            const douyinUrl = await scraper.getDouyinNoWatermarkVideo(douyinData);
            res.send({code: 0, data: [douyinUrl] })
        } else {
            const sec_user_id = await scraper.getUserSecUidByShareUrl(url)
            const result = await scraper.getHomeVideos(sec_user_id)
            const urls = result.map(i => i.url).flat(Infinity)
            res.send({code: 0, data: urls })
        }
    } catch (e) {
        res.send({code: 1, msg: String(e), data: null })
    }
})

app.listen(PORT, () => {
    console.log(`server is running on: ${PORT}`);
})