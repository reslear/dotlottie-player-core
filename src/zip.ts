import { strFromU8, unzip, type Unzipped } from 'fflate'

/**
 * @see https://stackoverflow.com/a/66046176
 */
async function base64fromU8(data: Uint8Array) {
  const base64url = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(new Blob([data]))
    reader.onload = () => resolve(reader.result)
  })

  return (base64url as string).split(',', 2)[1]
}

export async function ab2json(data: ArrayBuffer) {
  const u8 = new Uint8Array(data)
  const str = strFromU8(u8)
  return JSON.parse(str)
}

export async function unZip(buffer: ArrayBuffer) {
  const file = new Uint8Array(buffer)

  const lottieFile = await new Promise<Unzipped>((resolve, reject) => {
    unzip(file, (err, unzipped) => (err ? reject(err) : resolve(unzipped)))
  })

  return {
    read: (path: string) => strFromU8(lottieFile[path]),
    readB64: async (path: string) => await base64fromU8(lottieFile[path]),
  }
}

export type UnZip = Awaited<ReturnType<typeof unZip>>
