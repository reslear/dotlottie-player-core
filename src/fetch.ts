import type { LottieJson, LottieJsonAsset } from './types'
import { isBytesZip, parseManifest } from './utils'
import { UnZip, unZip } from './zip'

async function prepareLottieAssets(lottieJson: LottieJson, dotLottie: UnZip) {
  if (!('assets' in lottieJson)) {
    return lottieJson
  }

  async function parseAsset(asset: LottieJsonAsset) {
    if (!asset.p) {
      return asset
    }
    if (dotLottie.read(`images/${asset.p}`) == null) {
      return asset
    }

    const assetFileExtension = asset.p.split('.').pop() || ''

    // TODO: maybe fetch external image?
    const assetB64 = await dotLottie.readB64(`images/${asset.p}`)
    const isSvg = ['svg+xml', 'svg'].includes(assetFileExtension)

    Object.assign(asset, {
      // TODO: image/png, image/jpeg ?
      p: `data:${isSvg ? 'image/svg+xml' : ''};base64,${assetB64}`,
      e: 1,
    })

    return asset
  }

  const result = await Promise.all(
    lottieJson.assets.map((asset) => parseAsset(asset))
  )
  result.map((asset, i) => {
    lottieJson.assets[i] = asset
  })

  return lottieJson
}

export async function unZipDotLottie(response: ArrayBuffer) {
  const dotLottie = await unZip(response)
  const manifest = parseManifest(dotLottie.read('manifest.json'))

  const animations = await Promise.all(
    manifest.animations.map((a) => {
      const lottieJson: LottieJson = JSON.parse(
        dotLottie.read(`animations/${a.id}.json`)
      )
      return prepareLottieAssets(lottieJson, dotLottie)
    })
  )

  return {
    manifest,
    animations,
  }
}

export async function fetchLottie(url: string) {
  const bytes = await fetch(url).then((r) => r.arrayBuffer())

  if (isBytesZip(bytes)) {
    const { animations } = await unZipDotLottie(bytes)
    return animations[0]
  }

  /**
   * @see https://stackoverflow.com/a/60921969
   */
  // TODO: check is correct lottie object
  return JSON.parse(new TextDecoder().decode(bytes)) as LottieJson
}
