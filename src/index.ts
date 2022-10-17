import JSZip from 'jszip'

export function fetchLottie(path: string): Promise<string | undefined> {
  const fileFormat = path.split('.').pop()?.toLowerCase()
  let jsonFlag = false

  if (fileFormat === 'json') jsonFlag = true

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    if (jsonFlag) xhr.responseType = 'json'
    else xhr.responseType = 'arraybuffer'
    xhr.send()
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (jsonFlag) {
          resolve(xhr.response)
        }
        JSZip.loadAsync(xhr.response)
          .then((zip: any) => {
            zip
              .file('manifest.json')
              .async('string')
              .then((manifestFile: string) => {
                const manifest = JSON.parse(manifestFile)

                if (!('animations' in manifest)) {
                  throw new Error('Manifest not found')
                }

                if (manifest.animations.length === 0) {
                  throw new Error('No animations listed in the manifest')
                }

                const defaultLottie = manifest.animations[0]

                zip
                  .file(`animations/${defaultLottie.id}.json`)
                  .async('string')
                  .then((lottieFile: string) => {
                    const lottieJson = JSON.parse(lottieFile)

                    if ('assets' in lottieJson) {
                      Promise.all(
                        lottieJson.assets.map((asset: any) => {
                          if (!asset.p) {
                            return undefined
                          }
                          if (zip.file(`images/${asset.p}`) == null) {
                            return undefined
                          }

                          return new Promise((resolveAsset: any) => {
                            const assetFileExtension = asset.p.split('.').pop()

                            zip
                              .file(`images/${asset.p}`)
                              .async('base64')
                              .then((assetB64: any) => {
                                if (
                                  assetFileExtension === 'svg' ||
                                  assetFileExtension === 'svg+xml'
                                )
                                  asset.p =
                                    'data:image/svg+xml;base64,' + assetB64
                                else asset.p = 'data:;base64,' + assetB64

                                asset.e = 1

                                resolveAsset()
                              })
                          })
                        })
                      ).then(() => {
                        resolve(lottieJson)
                      })
                    }
                  })
              })
          })
          .catch((err: Error) => {
            reject(err)
          })
      }
    }
  })
}
