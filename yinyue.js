/**
 * @name GD音乐台
 * @description GD音乐台音源，基于 music-api.gdstudio.xyz
 * @version 1.0.0
 * @author Demo
 * @source https://music-api.gdstudio.xyz/api.php
 */
const BASE_URL = 'https://music-api.gdstudio.xyz/api.php'

// 音源入口
module.exports = {
  platform: 'gdmusic',
  version: '0.1',
  appVersion: '>=0.18.0',
  sources: ['netease', 'kuwo'], // 同时拉取网易、酷我源，可以自行增删
  supportQuality: ['128k', '320k'],
  // 搜索歌曲
  async searchMusic(keyword, page, limit) {
    const url = `${BASE_URL}?types=search&source=${this.sources.join(',')}&name=${encodeURIComponent(keyword)}&page=${page}&count=${limit}`
    const res = await globalThis.lx.request.get(url)
    const list = res.data
    if (!Array.isArray(list)) return { total: 0, list: [] }
    return {
      total: list.length,
      list: list.map(item => ({
        id: `${item.source}_${item.id}`,
        name: item.name,
        singer: Array.isArray(item.artist) ? item.artist.join(' / ') : item.artist,
        album: item.album || '',
        albumId: '',
        source: 'gdmusic',
        url: null,
        pic: item.pic || '',
        lyric: null,
        time: item.duration || 0,
        quality: [],
      }))
    }
  },
  // 获取播放地址
  async getMusicUrl(songInfo, quality) {
    const originSource = songInfo.id.split('_')[0]
    const originId = songInfo.id.split('_')[1]
    const br = quality === '320k' ? 320000 : 128000
    const url = `${BASE_URL}?types=url&id=${originId}&source=${originSource}&br=${br}`
    const res = await globalThis.lx.request.get(url)
    return { url: res.data?.url || null }
  },
  // 获取歌词
  async getLyric(songInfo) {
    const originSource = songInfo.id.split('_')[0]
    const originId = songInfo.id.split('_')[1]
    const url = `${BASE_URL}?types=lrc&id=${originId}&source=${originSource}`
    const res = await globalThis.lx.request.get(url)
    return res.data?.lrc || ''
  },
  // 获取歌曲封面
  async getPic(songInfo) {
    return { url: songInfo.pic }
  }
}
