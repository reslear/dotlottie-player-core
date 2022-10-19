import type { DotLottieManifest } from './types'

export function parseManifest(data: string) {
  const manifest: DotLottieManifest = JSON.parse(data)

  if (!('animations' in manifest)) {
    throw new Error('Manifest not found')
  }

  if (manifest.animations.length === 0) {
    throw new Error('No animations listed in the manifest')
  }

  return manifest
}

export function isBytesZip(bytes: ArrayBuffer) {
  /**
   * @see https://stackoverflow.com/a/23579140
   */
  const b = new Uint8Array(bytes, 0, 32)
  return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04
}

export async function fetchRequest(url: string, fetchOptions?: object) {
  // throw is bad url/request
  return await fetch(new URL(url).href, fetchOptions).then((r) =>
    r.arrayBuffer()
  )
}
