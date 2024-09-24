
const Scraper = require('..')
const express = require('express')
const path = require('path')
const fs = require('fs')
const { marked } = require('marked')
require('dotenv').config();

const app = express()
app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json()); // 用于解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: true }));
const scraper = new Scraper()
let PORT = process.env.PORT || 3000;

// readme docs
app.get('/readme', (req, res) => {
    const html = getReadmeContent()
    res.send(html)
})

app.post('/douyin', async (req, res) => {
    const url = req.body.url;
    try {
        const douyinId = await scraper.getDouyinVideoId(url);
        const douyinData = await scraper.getDouyinVideoData(douyinId);
        const douyinUrls = await scraper.getDouyinNoWatermarkVideo(douyinData);
        const imgUrl = await scraper.getDouyinImageUrls(douyinData)
        res.send({ code: 0, data: { video: douyinUrls, img: imgUrl } })
    } catch (e) {
        console.log('error', e)
        res.send({ code: 1, msg: String(e), data: null })
    }
})

app.post('/workflow', async (req, res) => {
    const url = req.body.url;
    try {
        const isHomeUrl = url.indexOf('查看TA的更多作品') !== -1
        if (!isHomeUrl) {
            const douyinId = await scraper.getDouyinVideoId(url);
            const douyinData = await scraper.getDouyinVideoData(douyinId);
            const douyinUrls = await scraper.getDouyinNoWatermarkVideo(douyinData);
            res.send({ code: 0, data: douyinUrls })
        } else {
            const sec_user_id = await scraper.getUserSecUidByShareUrl(url)
            const result = await scraper.getHomeVideos(sec_user_id)
            const urls = result.map(i => i.url).flat(Infinity)
            res.send({ code: 0, data: urls })
        }
    } catch (e) {
        console.log('error', e)
        res.send({ code: 1, msg: String(e), data: null })
    }
})

const getReadmeContent = () => {
    const content = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8')
    const htmlContent = marked(content)
    const htmlWithStyle = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Douyin No WaterMark Batch Download</title>
            <!-- 引入 GitHub Markdown CSS -->
            <link href="https://cdn.bootcdn.net/ajax/libs/reseter.css/2.0.0/minireseter.css" rel="stylesheet">
            <link rel="stylesheet" type="text/css" href="https://sindresorhus.com/github-markdown-css/github-markdown.css">
        </head>
        <body>
        <div class="markdown-body">${htmlContent}</div>
        <style>.markdown-body { padding: 20px 40px; box-sizing: border-box;}</style>
        </body>
        </html>
    `;
    return htmlWithStyle
}

const getArgsPort = () => {
    const args = process.argv.slice(2);
    const portArg = args.find(i => i.toLocaleUpperCase().indexOf('PORT') !== -1);
    if (portArg) {
        const port = portArg.split('=').pop()
        if (isNaN(Number(port))) return PORT
        return Number(port)
    } else {
        return PORT
    }
}


PORT = getArgsPort()
app.listen(PORT, () => {
    console.log(`server is running on: ${PORT} \n`);
})