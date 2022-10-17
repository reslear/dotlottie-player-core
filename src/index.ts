import JSZip from 'jszip'

interface DotLottieAnimation {
  id: string
  mode: string
  direction: string
}
interface DotLottieManifest {
  animations: DotLottieAnimation[]
  author: string
  description: string
  name: string
  version: string
  generator: string
  keywords: string[]
}

interface LottieJsonAsset {
  p: string
  e: number
}
interface LottieJson {
  assets: LottieJsonAsset[]
}

async function parseManifest(data: string) {
  const manifest: DotLottieManifest = JSON.parse(data)

  if (!('animations' in manifest)) {
    throw new Error('Manifest not found')
  }

  if (manifest.animations.length === 0) {
    throw new Error('No animations listed in the manifest')
  }

  return manifest
}

async function unZipDotLottieManifest(zip: JSZip) {
  const manifestFile = zip.file('manifest.json')

  if (!manifestFile) {
    throw new Error('manifest.json not found')
  }

  const data = await manifestFile.async('string')
  const manifest = await parseManifest(data)

  return manifest
}

async function prepareLottieAnimation(animationId: string, zip: JSZip) {
  const animationFile = zip.file(`animations/${animationId}.json`)

  if (!animationFile) {
    throw new Error(`animation id ${animationId} not found`)
  }

  const data = await animationFile.async('string')

  // TODO: parse and check file is animation
  // TODO: lottie type
  const lottieJson = JSON.parse(data) as LottieJson
  const lottie = await prepareLottieAssets(lottieJson, zip)

  return lottie
}

async function prepareLottieAssets(lottieJson: LottieJson, zip: JSZip) {
  if (!('assets' in lottieJson)) {
    return lottieJson
  }

  async function parseAsset(asset: LottieJsonAsset) {
    if (!asset.p) {
      return asset
    }
    if (zip.file(`images/${asset.p}`) == null) {
      return asset
    }

    const assetFileExtension = asset.p.split('.').pop() || ''

    // TODO: maybe fetch external image?
    const assetB64 = await zip.file(`images/${asset.p}`)!.async('base64')
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

export async function unZipDotLottie(response: any) {
  const zip = await JSZip.loadAsync(response)

  const manifest = await unZipDotLottieManifest(zip)

  const animations = await Promise.all(
    manifest.animations.map((a) => prepareLottieAnimation(a.id, zip))
  )

  return {
    manifest,
    animations,
  }
}

async function fetchUrl(url: string, jsonFlag: boolean) {
  const response = fetch(url, {
    //mode: 'no-cors',
  })

  if (jsonFlag) {
    return await response.then((res) => res.json())
  }

  const blob = await response.then((res) => res.blob())

  return blob
}

export async function fetchLottie(url: string) {
  const fileFormat = url.split('.').pop()?.toLowerCase()
  const isJson = fileFormat === 'json'

  const response = await fetchUrl(url, isJson)

  if (isJson) {
    return response as object
  }

  const { animations } = await unZipDotLottie(response)

  return animations[0]
}
