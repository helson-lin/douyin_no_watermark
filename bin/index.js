const fetch = require('node-fetch')
const { sign } = require('./sign')
const download = require('download')
const getDeepProperty = require("@orange-opensource/get-deep-property");
class Scraper {

    constructor() {
        this.headers = { // sign 需要的参数
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        };

        this.douyinApiHeaders = {
            'accept-encoding': 'gzip, deflate, br',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'referer': 'https://www.douyin.com/',
            'cookie': 'sid_guard=8bab9db9236a2e19efedbbd6322bc19f%7C1725259804%7C5183999%7CFri%2C+01-Nov-2024+06%3A50%3A03+GMT;'
            // 其他请求头
        };
    }

    /**
     * @description get videoId by share url
     * @param {string} url 
     * @returns {string} videoId
     */
    getVideoIdByShareUrl(url) {
        const headers = {
            authority: 'v.douyin.com',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        }
        return new Promise((resolve, reject) => {
            fetch(url, {
                headers,
                onRedirect (res, nextOptions) {
                    return nextOptions;
                }
            }).then((res) => {
                if (!res?.url) reject(new Error('can\'t get room id'))
                // let videoId = res?.url?.match(/video\/(\d+)/)?.[1];
                const videoId = res?.url?.match(/(slides|video|note)\/(\d+)/)?.[2]; 
                if (!videoId) reject(new Error('can\'t get videoId, please check your url'))
                resolve(videoId)
            })
        })
    }
    /**
     * @description get sec_user_id by shared home page url
     * @param {string} url 用户主页分享地址 
     * @returns {string} sec_user_id
     */
    getUserSecUidByShareUrl(url) {
        const headers = {
            authority: 'v.douyin.com',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        }
        return new Promise((resolve, reject) => {
            const reg = new RegExp('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
            const matchUrl = url.match(reg)
            if (!matchUrl || !matchUrl[0]) {
                reject('输入链接没有解析到地址')
            } else {
                fetch(matchUrl[0], headers).then((res) => {
                    if (!res?.url) reject('地址有误')
                    try {
                        const userSplitArr = new URL(res.url).pathname.split('user')
                        const sec_user_id = userSplitArr[userSplitArr.length - 1].replace('/', '')
                        resolve(sec_user_id)
                    } catch (e) {
                        reject('获取sec_uid失败')
                    }
                })
            }
        })
    }

    /**
    * @description get douyin videoId by url
    * @param {string} url 
    * @returns {string} videoId
    */
    async getDouyinVideoId(url) {
        const reg = new RegExp('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        const relUrl = url.match(reg)
        if (!relUrl || !relUrl[0]) {
            throw new Error("输入链接没有解析到地址")
        } else {
            let videoId = await this.getVideoIdByShareUrl(relUrl[0]);
            return videoId;
        }
    }
    /**
     * @description get videoData by video id
     * @param {string} videoId
     * @returns {object}v videoData
     */
    async getDouyinVideoData(videoId) {
        let apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/detail/?device_platform=webapp&aid=6383&channel=channel_pc_web&aweme_id=${videoId}&pc_client_type=1&version_code=190500&version_name=19.5.0&cookie_enabled=true&screen_width=1344&screen_height=756&browser_language=zh-CN&browser_platform=Win32&browser_name=Firefox&browser_version=110.0&browser_online=true&engine_name=Gecko&engine_version=109.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=&platform=PC&webid=7158288523463362079&msToken=abL8SeUTPa9-EToD8qfC7toScSADxpg6yLh2dbNcpWHzE0bT04txM_4UwquIcRvkRb9IU8sifwgM1Kwf1Lsld81o9Irt2_yNyUbbQPSUO8EfVlZJ_78FckDFnwVBVUVK`;
        const urlParser = new URL(apiUrl)
        const query = urlParser.search.replace('?', '')
        console.log('【parser】query参数：', query, 'User-agent：', this.headers['User-Agent'])
        const a_bogus = await sign(query, this.headers['User-Agent'])
        console.log('【parser】 生成的a_bogus签名为: ' + a_bogus)
        const new_url = apiUrl + "&a_bogus=" + a_bogus
        console.log('【parser】 正在获取视频数据: \n')
        try {
            const res = await fetch(new_url, {
                headers: this.douyinApiHeaders
            })
            const json = res.json();
            return json;
        } catch (e) {
           throw new Error(e);
        }
        // return new Promise((resolve, reject) => {
        //     fetch(new_url, {
        //         headers: this.douyinApiHeaders
        //     }).then((res) => res.json())
        //         .then(json => {
        //             resolve(json)
        //         })
        //         .catch(err => reject(err));
        // })
    }

    /**
     * @description parser no watermark video url
     * @param {object} videoData 
     * @returns {string}
     */
    async getDouyinNoWatermarkVideo(videoData) {
        let noWatermarkUrls = [];
        const isImagesShare = [2, 42].includes(videoData.aweme_detail.media_type)
        if (!isImagesShare) {
            const url = videoData.aweme_detail.video.play_addr.url_list[0];
            // console.log('url:', url)
            // 针对部分视频进行处理，不是所有的都需要
            // const key = videoData.aweme_detail.video.play_addr.uri.replace('video/', '');
            // const noWatermarkUrl = url.replace('/play/', '/playwm/') + '?video_id=' + key;
            const noWatermarkUrl = url.replace('/play/', '/playwm/');
            if (noWatermarkUrl) {
                noWatermarkUrls = [noWatermarkUrl]
            }
        } else {
            // 图片分享
            let images = videoData?.aweme_detail?.images
            noWatermarkUrls = images.map(i => {
                if (!i?.url_list) return null
                const maxSizePicIndex = i?.url_list.length - 1
                return i?.url_list[maxSizePicIndex]
            }).filter(i => i)
        }
        return noWatermarkUrls;
    }

    /**
     * @description parser watermark video url
     * @param {object} videoData 
     * @returns {string}
     */
    async getDouyinWatermarkVideo(videoData) {
        return videoData.aweme_detail.video.download_addr.url_list[0];
    }

    async getDouyinImageUrls(videoData) {
        return videoData.aweme_detail.video.cover.url_list[0]
    }

    async parserVideoData(videoData) {
        const authInfo = getDeepProperty(videoData, 'aweme_detail.author')
        const video = getDeepProperty(videoData, 'aweme_detail.video')
        console.log(authInfo, video)
    }

    /**
     * @description download video to local
     * @param {string} videoId 视频的id
     * @param {string} videoName 文件名称
     * @param {string} dirname 目录地址
     */
    async downloadVideo(videoId, videoName, dirname) {
        const videoData = await this.getDouyinVideoData(videoId)
        let url = await this.getDouyinNoWatermarkVideo(videoData);
        await download(url, dirname ? `media/${dirname}` : 'media', { filename: `${videoName}.mp4` })
    }



    /**
     * @description Replaces all special characters in the string (including Spaces)/替换字符串中的所有特殊字符（包含空格）
     * @date 2024/1/4 - 19:45:52
     * @param {*} string
     * @returns {*}
     */
    trimSpecial(string) {
        if (string != "") {
            const pattern = /[`~!@ᓚᘏᗢ‧˚₊♡$^\-&*()=|{}':;',\\\[\]\.<>\/?~！@ᓚᘏᗢ‧˚₊♡￥……&*（）——|{}【】'；：""'。，、？\s]/g;
            string = string.replace(pattern, "");
        }
        return string
    }
    /**
     * @description get video url by videoData
     * @date 2024/1/4 - 19:24:04
     * @async
     * @param {string} videoId
     * @returns {string} videoUrl
     */
    async getVideoUrl(videoId, videoName, authorName) {
        const videoData = await this.getDouyinVideoData(videoId)
        let url = await this.getDouyinNoWatermarkVideo(videoData);
        let name = `${authorName}-${videoName}`
        name = this.trimSpecial(name)
        return { url, name }
    }

    /**
     * @description get author all videos
     * @param {string} sec_user_id 
     */
    async getHomeVideos(sec_user_id) {
        return new Promise(async (resolve, reject) => {
            let result = []
            let maxCursor = 0
            let awemeLen = 1;
            do {
               try {
                let apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/post/?sec_user_id=${sec_user_id}&count=35&max_cursor=${maxCursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;
                const urlParser = new URL(apiUrl)
                const query = urlParser.search.replace('?', '')
                const xbogus = sign(query, this.headers['User-Agent'])
                const new_url = apiUrl + "&X-Bogus=" + xbogus
                const headers = JSON.parse(JSON.stringify(this.douyinApiHeaders))
                // headers.cookie += 'sessionid=69b218330b62e948d2f62a8f1a8e698c'
                const res = await fetch(new_url, { headers })
                const data = await res.json()
                const { aweme_list, max_cursor } = data
                if (max_cursor) maxCursor = max_cursor
                awemeLen = aweme_list.length
                result = result.concat(aweme_list)
                // 间隔一定随机时间防止被ban 
                await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
               } catch (e) {}
            } while (awemeLen > 0)
            const authorName = getDeepProperty(result, '0.author.nickname')
            // download to local media dir
            // const videoIds = result.map(i => this.getVideoUrl(i.aweme_id, i.desc, authorName))
            // get download info
            const viodes = result.map(i => this.getVideoUrl(i.aweme_id, i.desc, authorName))
            Promise.allSettled(viodes).then((results) => {
                // const isHasFailed = results.filter(res => res.status === 'rejected')
                // console.log(isHasFailed.map(i => i.value))
                const data = results.filter(res => res.status === 'fulfilled').map(i => i.value)
                resolve(data)
            })
        })
    }

    /**
     * @description 获取今天的视频
     * @param {string} sec_user_id 用户id
     */
    async getTodayVideo(sec_user_id) { }
}

module.exports = Scraper;
