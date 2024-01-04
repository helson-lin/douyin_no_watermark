const fetch = require('node-fetch')
const { sign } = require('./X-Bogus')
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
            'cookie': 'n_mh=ZGkDUDq87_ReJpNDNjXJAcIlxSe3cA3dXF3pz7Vo1So; LOGIN_STATUS=1; store-region=cn-ah; store-region-src=uid; my_rd=1; ttwid=1%7CLkU2OLnKWs8DcVLGMP_dxHcLobk9Y_e-SSDlUKglsiM%7C1687349374%7C7ea67aa5225ad7fcef78191fd87dea42b2281cd2ffe1bcb205c5b9d5fe3f3ff7; s_v_web_id=verify_lkcquhow_M0SokhHW_aHUZ_4ui0_92nd_t45hIoyFwlF0; passport_csrf_token=ae1d4b9e0f6b3dd26dcdd858c74f1373; passport_csrf_token_default=ae1d4b9e0f6b3dd26dcdd858c74f1373; passport_assist_user=CjzG2846zH4nSFD12e3ghPYNBgVTysxLmt3P0hRO1e6x0z-quOC5aMrxB3mrdK60HTBt9XFvCfBsq5MfKqYaSAo8hG-cIbPHcQ1Aue3pau4dTSAcJ3AeIR8-NqaW0lrmyWdtRikQRByqm7IPca9yb-aF6r41GhlvdFAoD8gzEIq_uA0Yia_WVCIBA_D4Aq0%3D; sso_uid_tt=9630cb01a699aa5c33a8808e718ec11b; sso_uid_tt_ss=9630cb01a699aa5c33a8808e718ec11b; toutiao_sso_user=996cb6a83b1c5c2b713af855b64cc098; toutiao_sso_user_ss=996cb6a83b1c5c2b713af855b64cc098; odin_tt=5308c2d274686bdafa9204700857b3e8f169e15e0c9caadc1cf46bea997712ecb32029d28f08ad7147305fa071c5ba5a; uid_tt=d26841f0ed166bbf0e8fbba5a6eddd4e; uid_tt_ss=d26841f0ed166bbf0e8fbba5a6eddd4e; sid_tt=69b218330b62e948d2f62a8f1a8e698c; sessionid=69b218330b62e948d2f62a8f1a8e698c; sessionid_ss=69b218330b62e948d2f62a8f1a8e698c; _bd_ticket_crypt_cookie=9c7b4fc95ad98147cf18ff9498c897fc; __security_server_data_status=1; __live_version__=%221.1.1.3119%22; sid_ucp_sso_v1=1.0.0-KDcwNGVmYjFiMjJiMDkwYmY1Y2ZmOGVhYjc0ZWYyMWQ2Y2M2ZGM1NzAKHQj2h_PV7gEQqoTLpwYY7zEgDDCgos3LBTgGQPQHGgJobCIgOTk2Y2I2YTgzYjFjNWMyYjcxM2FmODU1YjY0Y2MwOTg; ssid_ucp_sso_v1=1.0.0-KDcwNGVmYjFiMjJiMDkwYmY1Y2ZmOGVhYjc0ZWYyMWQ2Y2M2ZGM1NzAKHQj2h_PV7gEQqoTLpwYY7zEgDDCgos3LBTgGQPQHGgJobCIgOTk2Y2I2YTgzYjFjNWMyYjcxM2FmODU1YjY0Y2MwOTg; sid_guard=69b218330b62e948d2f62a8f1a8e698c%7C1693631018%7C5184000%7CWed%2C+01-Nov-2023+05%3A03%3A38+GMT; sid_ucp_v1=1.0.0-KDg2ZDc3NDdmYzFlNGIyM2FkM2ZjN2RjMjQ1MjQ2MzQ3MmJhZWYwYmIKGQj2h_PV7gEQqoTLpwYY7zEgDDgGQPQHSAQaAmxxIiA2OWIyMTgzMzBiNjJlOTQ4ZDJmNjJhOGYxYThlNjk4Yw; ssid_ucp_v1=1.0.0-KDg2ZDc3NDdmYzFlNGIyM2FkM2ZjN2RjMjQ1MjQ2MzQ3MmJhZWYwYmIKGQj2h_PV7gEQqoTLpwYY7zEgDDgGQPQHSAQaAmxxIiA2OWIyMTgzMzBiNjJlOTQ4ZDJmNjJhOGYxYThlNjk4Yw; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSi9YaFJNYkE1RlVGUzlldjFzcXpWZXNuRktqUmNxSjFnam9GQmdOMlJKclo3Wnc4N1JKTjZMdnZNV2lTLzFuWkorZFNqdUd5QWEvTHp3T2o4ZjhJbkk9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ==; __ac_nonce=065066d6d00dcec9d7f9d; __ac_signature=_02B4Z6wo00f01L2LOtwAAIDBQ8dG7f90QiS9qz5AAEppU8rmnlMQQsT0Wn6rUXj7BV7tk8Gud6ZIrtX.3ZI2WrJGBOfZkNeKvNOfm3PthvMBa4wmCicgabm09qyR4wvj-p4okPGfy5oYGH8R58; publish_badge_show_info=%220%2C0%2C0%2C1694920048606%22; home_can_add_dy_2_desktop=%220%22; strategyABtestKey=%221694920048.622%22; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAA1T1gJAQars4T_ve8V3T5Ld9J3GCAsNLpTlr6EhV36C0%2F1694966400000%2F0%2F1694920048827%2F0%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Afalse%2C%22volume%22%3A0.056%7D; csrf_session_id=6c84522dbdac6372ee9ae3ffbe850bcf; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1920%2C%5C%22screen_height%5C%22%3A1080%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A12%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A100%7D%22; passport_fe_beating_status=true; msToken=4UD4cbYDcXUIVw66rmBqxwfRBKQfv0PaBaFZzMUt40-f92dR4decmUv4J334pfUdfukAVOEo5Kfmj-SjJh_gU8H03z1GZ1nDw8RWJRJp2wXSjlcNrBcoQw==; msToken=pG-e7TIA9uAyR8ui6-WI5IicyjjjOSkdNPwgIx_wqDzZxKz9ca3DPcZkzgiCByT4wcdWKKRrvt2MkRXB7q5auYl5wZZCxwBfhK8AfLebhBJm7HJaU1cKyw==; tt_scid=lb4xIawlluUIQ5M7sNX4dyoz.AvNwFZb9wJzYhW0Q6817bpVd84GEg3G.LUSKlgTa71b; download_guide=%222%2F20230917%2F0%22;'
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
            fetch(url, headers).then((res) => {
                if (!res?.url) reject(new Error('can\'t get room id'))
                const videoId = res?.url?.match(/video\/(\d+)/)[1];
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
    getDouyinVideoData(videoId) {
        let apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/detail/?device_platform=webapp&aid=6383&channel=channel_pc_web&aweme_id=${videoId}&pc_client_type=1&version_code=190500&version_name=19.5.0&cookie_enabled=true&screen_width=1344&screen_height=756&browser_language=zh-CN&browser_platform=Win32&browser_name=Firefox&browser_version=110.0&browser_online=true&engine_name=Gecko&engine_version=109.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=&platform=PC&webid=7158288523463362079&msToken=abL8SeUTPa9-EToD8qfC7toScSADxpg6yLh2dbNcpWHzE0bT04txM_4UwquIcRvkRb9IU8sifwgM1Kwf1Lsld81o9Irt2_yNyUbbQPSUO8EfVlZJ_78FckDFnwVBVUVK`;
        const urlParser = new URL(apiUrl)
        const query = urlParser.search.replace('?', '')
        const xbogus = sign(query, this.headers['User-Agent'])
        console.log('【parser】 生成的X-Bogus签名为: ' + xbogus)
        const new_url = apiUrl + "&X-Bogus=" + xbogus
        console.log('【parser】 正在获取视频数据API: \n' + new_url)
        return new Promise((resolve, reject) => {
            fetch(new_url, {
                headers: this.douyinApiHeaders
            }).then(res => res.json())
                .then(json => {
                    resolve(json)
                })
                .catch(err => reject(err));
        })
    }

    /**
     * @description parser no watermark video url
     * @param {object} videoData 
     * @returns {string}
     */
    async getDouyinNoWatermarkVideo(videoData) {
        let url = videoData.aweme_detail.video.play_addr.url_list[0];
        let key = videoData.aweme_detail.video.play_addr.uri.replace('video/', '');
        let noWatermarkUrl = url.replace('/play/', '/playwm/') + '?video_id=' + key;
        return noWatermarkUrl;
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
        return new Promise((resolve, reject) => {
            // 下面判断规则是通过视频地址总结的
            // The following rules are summarized by video address
            if (url.indexOf('.mp3') !== -1 || url.indexOf('mime_type=video_mp4') === -1) {
                reject("The user's work is not a video.")
            } else {
                resolve({ url, name })
            }
        })
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
                let apiUrl = `https://www.douyin.com/aweme/v1/web/aweme/post/?sec_user_id=${sec_user_id}&count=35&max_cursor=${maxCursor}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;
                const urlParser = new URL(apiUrl)
                const query = urlParser.search.replace('?', '')
                const xbogus = sign(query, this.headers['User-Agent'])
                const new_url = apiUrl + "&X-Bogus=" + xbogus
                const headers = JSON.parse(JSON.stringify(this.douyinApiHeaders))
                // headers.cookie += 'sessionid=69b218330b62e948d2f62a8f1a8e698c'
                const res = await fetch(new_url, { headers })
                // console.log(new_url)
                const data = await res.json()
                const { aweme_list, max_cursor } = data
                if (max_cursor) maxCursor = max_cursor
                awemeLen = aweme_list.length
                result = result.concat(aweme_list)
                // 间隔一定随机时间防止被ban 
                await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
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
