export interface DotLottieAnimation {
  id: string
  mode: string
  direction: string
}
export interface DotLottieManifest {
  animations: DotLottieAnimation[]
  author: string
  description: string
  name: string
  version: string
  generator: string
  keywords: string[]
}

export interface LottieJsonAsset {
  p: string
  e: number
}

export interface LottieJson {
  assets: LottieJsonAsset[]
}
