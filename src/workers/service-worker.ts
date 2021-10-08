const sw = self as ServiceWorkerGlobalScope & typeof globalThis

class GenericServiceWorker {
  constructor(
      public self: ServiceWorkerGlobalScope & typeof globalThis,
      public caches: { install: string, fetch: string },
      public knownUrls: string[]
  ) {
    this.self.addEventListener('install', ev => ev.waitUntil(async () => this.onInstall()))
    this.self.addEventListener('activate', ev => ev.waitUntil(async () => this.onActivate()))
    this.self.addEventListener('fetch', ev => this.onFetch(ev))
  }
  
  get cacheNames() {
    return Object.values(this.caches)
  }
  
  async onInstall() {
    const cache = await caches.open(this.caches.install)
    await cache.addAll(this.knownUrls)
    await this.self.skipWaiting()
  }
  
  async onActivate() {
    const currentCaches = await caches.keys()
    const oldCaches = currentCaches.filter(cacheName => !this.cacheNames.includes(cacheName))
    
    await Promise.all(oldCaches.map(expiredCache => {
      return caches.delete(expiredCache)
    }))
    
    await this.self.clients.claim()
  }
  
  async onFetch(event: FetchEvent) {
    const url = new URL(event.request.url, sw.location.href)
    
    if (url.protocol.startsWith('http') && url.origin === self.location.origin) {
      event.respondWith(this.fetchLocal(event))
    }
  }
  
  async fetchLocal(event: FetchEvent) {
    const cachedResponse = await caches.match(event.request)
    const fetchedPromise = fetch(event.request)
    
    if (cachedResponse) {
      fetchedPromise.then(async (response) => {
        const installCache = await caches.open(this.caches.install)
        await installCache.put(event.request, response)
      })
      return cachedResponse
    }
    
    const fetchedResponse = await fetchedPromise
    const fetchCache = await caches.open(this.caches.fetch)
    fetchCache.put(event.request, fetchedResponse.clone()).then()
    
    return fetchedResponse
  }
}

(self as any).cacheService = new GenericServiceWorker(
    sw,
    {install: 'install', fetch: 'fetch'},
    [
      './',
      'index.html',
      'index.js',
      'index.css'
    ]
)
