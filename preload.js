const { contextBridge } = require('electron')

// expose simple storage API to renderer
contextBridge.exposeInMainWorld('storage', {
  save: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  load: (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
})
