export default abstract class Indexable<T extends Indexable<T>> {
  protected _indexHandler: ProxyHandler<T> = {
    set: (target, property, value, receiver) => {
      if (target.setHandler && property !== '_proxy' && this._proxy) {
        const result = target.setHandler(property, value, receiver)
        return !!result
      }
      else
        return target._originalSet(property, value, receiver)
    },
    
    get: (target, property, receiver) => {
      if (target.getHandler && property !== '_proxy' && this._proxy)
        return target.getHandler(property, receiver)
      else
        return target._originalGet(property, receiver)
    }
  }
  
  protected _original: Indexable<T>
  protected _proxy: boolean
  
  protected constructor() {
    this._original = this
    this._proxy = false
    return new Proxy(this as Indexable<T>, this._indexHandler)
  }
  
  protected setHandler?(p: string | symbol, value: any, receiver: any): boolean
  
  protected getHandler?(p: string | symbol, receiver: any): any
  
  protected _originalSet(property: string | symbol, value: any, receiver: any) {
    return Reflect.set(this._original, property, value, receiver)
  }
  
  protected _originalGet(property: string | symbol, receiver: any) {
    return Reflect.get(this._original, property, receiver)
  }
}
