const Scraper = require('.')

const scraper = new Scraper()

const douyinUrl = '3.53 复制打开抖音，看看【cLean克泠的图文作品】假如你现在18岁 在挪威留学。# 挪威 # 旅行 ... https://v.douyin.com/ikpUN1Mg/ 03/24 A@g.Ox Njc:/ '
// const douyinUrl = '0.51 03/08 NjP:/ Y@z.tE 复制打开抖音，看看【颜值 可能有关】你愿意陪我去北京嘛ᜊ•ᴗ•ᜊ# 好困  https://v.douyin.com/ieYQPSW'

const test = async (url) => { 
    const douyinId = await scraper.getDouyinVideoId(url);
    const douyinData = await scraper.getDouyinVideoData(douyinId);
    console.log(douyinData)
}

test(douyinUrl)
// 3.53 复制打开抖音，看看【cLean克泠的图文作品】假如你现在18岁 在挪威留学。# 挪威 # 旅行 ... https://v.douyin.com/ikpUN1Mg/ 03/24 A@g.Ox Njc:/ 
// 1- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoHneS/
// 7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoE3ob/
// test('长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ie9A1PWy/')
