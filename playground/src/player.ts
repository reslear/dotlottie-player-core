import '@lottiefiles/lottie-player'
import type { LottiePlayer } from '@lottiefiles/lottie-player'
import { fetchLottie } from 'dotlottie-player-core'

const app = document.querySelector<HTMLButtonElement>('#app')!

let inputUrl = document.createElement('input')
let buttonUpdate = document.createElement('button')
let player = document.createElement('lottie-player') as LottiePlayer

export async function setAnimation(url: string) {
  const animationData = await fetchLottie(url)

  console.log(animationData)

  if (animationData) {
    player.load(animationData)
  }
}

export async function initApp() {
  Object.assign(inputUrl, {
    id: 'url',
    value:
      'https://assets10.lottiefiles.com/dotlotties/dlf10_FBr6YSQU8K.lottie',
    placeholder: 'Link to .lottie or .josn file...',
    style: 'width: 100%;',
  })

  Object.assign(buttonUpdate, {
    id: 'update',
    type: 'button',
    innerText: 'Fetch',
    style: 'margin-top: 10px',
    onclick: () => setAnimation(inputUrl.value),
  })

  Object.assign(player, {
    autoplay: true,
    controls: true,
    loop: true,
    mode: 'normal',
    style: 'width: 320px; margin: 0 auto',
  })

  app.append(inputUrl, document.createElement('br'), buttonUpdate, player)

  setAnimation(inputUrl.value)
}
