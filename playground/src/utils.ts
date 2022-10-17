async function getDataFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      resolve(result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

export async function openFilePicker(): Promise<string | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.lottie,.json'
    input.multiple = false
    input.addEventListener(
      'change',
      () => {
        const files = Array.from(input.files || [])

        getDataFromFile(files[0]).then((data) => {
          resolve(data)
        })
      },
      { once: true }
    )

    input.click()
  })
}
