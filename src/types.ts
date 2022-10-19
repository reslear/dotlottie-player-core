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
  id: string
  u?: string
  p?: string
  e?: number
  layers?: LottieJsonLayer[]
}

export interface LottieJsonLayer {
  ty: number
  nm: string
  ks: any
  ao: number
  ddd: number
  ind: number
  ip: number
  op: number
  refId?: string
}

export interface LottieJson {
  // Version
  v: string
  // Frame Rate
  fr: number
  // Start keyframe
  ip: number
  // End keyframe
  op: number
  // Width
  w: number
  // Height
  h: number
  // Duration
  nm: string
  // 3d
  ddd: number
  // Assets
  assets: LottieJsonAsset[]
  // Layers
  layers: LottieJsonLayer[]
  markers: LottieJsonLayer[]
}
