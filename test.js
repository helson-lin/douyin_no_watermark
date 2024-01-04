const Scraper = require('.')

const scraper = new Scraper()

// const douyinUrl = '7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieApRo4r/'
// const douyinUrl = '0.51 03/08 NjP:/ Y@z.tE 复制打开抖音，看看【颜值 可能有关】你愿意陪我去北京嘛ᜊ•ᴗ•ᜊ# 好困  https://v.douyin.com/ieYQPSW'

const test = async (url) => { 
    const sec_user_id = await scraper.getUserSecUidByShareUrl(url)
    console.log('sec_user_id:' + sec_user_id)
    const result = await scraper.batcgetHomeVideoshDownload(sec_user_id)
    console.log(result)
}

// test('7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieApRo4r/')
// 1- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoHneS/
// 7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoE3ob/
test('长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ie9A1PWy/')
