import '@lottiefiles/lottie-player'
import type { LottiePlayer } from '@lottiefiles/lottie-player'
import { fetchLottie } from '@reslear/dotlottie-player-core'
import { openFilePicker } from './utils'

const app = document.querySelector<HTMLButtonElement>('#app')!

let inputUrl = document.createElement('input')
let buttonUpdate = document.createElement('button')
let player = document.createElement('lottie-player') as LottiePlayer

export async function setAnimation(url: string | undefined) {
  if (!url) {
    return
  }

  const animation = await fetchLottie(url)

  console.log(animation)

  if (animation) {
    player.load(animation)
  }
}

export async function initApp() {
  Object.assign(inputUrl, {
    id: 'url',
    value:
      'https://assets10.lottiefiles.com/dotlotties/dlf10_FBr6YSQU8K.lottie',
    placeholder: 'Link to .lottie or .json file...',
    style: 'width: 100%;',
  })

  Object.assign(buttonUpdate, {
    id: 'update',
    type: 'button',
    innerText: 'Fetch',
    style: 'margin: 10px',
    onclick: () => setAnimation(inputUrl.value),
  })

  Object.assign(player, {
    autoplay: true,
    controls: true,
    loop: true,
    mode: 'normal',
    style: 'width: 320px; margin: 0 auto',
  })

  const pickFileButton = Object.assign(document.createElement('button'), {
    style: 'margin: 10px',
    innerText: 'Open local file...',
    onclick: () => openFilePicker().then((url) => setAnimation(url)),
  })

  app.append(
    inputUrl,
    document.createElement('br'),
    buttonUpdate,
    (document.createElement('span').innerHTML = 'or'),
    pickFileButton,
    player
  )

  setAnimation(inputUrl.value)
}
