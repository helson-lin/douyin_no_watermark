const Scraper = require('.')

const scraper = new Scraper()
const douyinUrl = '被我挖到了！超好喝的冰镇茶饮#东方树叶黑乌龙 #东方树叶 https://v.douyin.com/ie246jKR/ 复制此链接，打开【抖音短视频】，直接观看视频！'
// const douyinUrl = '0.51 03/08 NjP:/ Y@z.tE 复制打开抖音，看看【颜值 可能有关】你愿意陪我去北京嘛ᜊ•ᴗ•ᜊ# 好困  https://v.douyin.com/ieYQPSW'

const test = async (url) => { 
    const sec_user_id = await scraper.getUserSecUidByShareUrl(url)
    await scraper.test(sec_user_id)
    // scraper.test(maxCursor)
    // scraper.getAllAuthorVideoTest()
    // const sec_uid = await scraper.getUserSecUidByShareUrl(url)
    // console.log('sec_uid:' + sec_uid)
    // await scraper.getAllAuthorVideo(sec_uid)
    // let douyinId = await scraper.getDouyinVideoId(url);
    // let douyinData = await scraper.getDouyinVideoData(douyinId);
    // // await scraper.parserVideoData(douyinData)
    // let douyinUrl = await scraper.getDouyinNoWatermarkVideo(douyinData);
    // let images = await scraper.getDouyinImageUrls(douyinData)
}

// test('7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieApRo4r/')
// 1- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoHneS/
// 7- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieAoE3ob/
test('4- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/ieDmNoXJ/')
