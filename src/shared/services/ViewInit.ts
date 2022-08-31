import { nextTick } from 'vue'

import { useInitializeStore } from '@/stores/app/initialize'
import { useDatasStore } from '@/stores/app/datas'
import { DataStoreIds } from '@/stores/app/datas/enums'
import { LocaleViewNamespaces } from '@/stores/app/language/enums'
import { InitializeStatus } from '@/stores/app/initialize/enums'
import { useLanguageStore } from '@/stores/app/language'

interface ViewInitItem {
  id: DataStoreIds;
  promise: Promise<() => Promise<void>>;
  message: string;
  loaded: boolean;
}

export async function ViewInitSlient(...inits: DataStoreIds[]) {
  const datasStore = useDatasStore()
  const initItems = inits
    .map((id) => {
      const loaded = datasStore.checkLoaded(id)
      const promise = loaded ? Promise.resolve(() => Promise.resolve()) : (datasStore[`init${id}`]())
      return { id, promise, loaded }
    })

  const finishedInitItems = await Promise.all(initItems.map(async item => {
    try {
      const init = await item.promise
      return {
        id: item.id,
        init,
      }
    } catch (err) {
      console.error(err)
    }
    return {
      id: item.id,
      init: () => Promise.resolve(),
    }
  }))
  await Promise.all(finishedInitItems.map(async item => {
    try {
      await item.init()
      datasStore.loadFinished(item.id)
    } catch (err) {
      console.error(err)
    }
  }))
}

export async function ViewInit(...inits: DataStoreIds[]) {
  const initializeStore = useInitializeStore()
  const datasStore = useDatasStore()

  initializeStore.initState()
  await nextTick()

  if (inits.length === 0) {
    await initializeStore.startInitLocale()
    initializeStore.skipInit()
    return
  }

  const initItems = inits
    .map((id) => {
      const loaded = datasStore.checkLoaded(id)
      const promise = loaded ? Promise.resolve(() => Promise.resolve()) : (datasStore[`init${id}`]())
      console.log(`[Init: ${id}] ${loaded ? 'The item is loaded. Skip loading.' : 'Loading...'}`)
      const message = 'app.loading-message.' + id
      return { id, promise, message, loaded } as ViewInitItem
    })

  initItems.forEach(item => initializeStore.appendInitItems(item))

  const finishedInitItems = await initializeStore.startInit()
  await Promise.all(finishedInitItems.map(async item => {
    await item.init()
    console.log(`[Init: ${item.id}] Loading finished.`)
    datasStore.loadFinished(item.id)
  }))

  if (initializeStore.status === InitializeStatus.Error) {
    return
  }

  await initializeStore.startInitLocale()

  await initializeStore.initBeforeFinished()
}

export function PrepareLocaleInit(...namespaces: LocaleViewNamespaces[]) {
  const initializeStore = useInitializeStore()
  const languageStore = useLanguageStore()
  namespaces = namespaces.filter(namespace => !languageStore.i18nLoadedLocaleNamespaces.has(namespace))
  initializeStore.appendLoadLocaleNamespace(...namespaces)
}
