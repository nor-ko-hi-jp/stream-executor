import { BaseExecutor } from './__interfaces__'
import { Action, PromiseOr } from '../types'

export class ChainExecutor<T> implements BaseExecutor {
  private _initialValue: T
  private _actions: Action<PromiseOr<any>, PromiseOr<any>>[] = []

  constructor(initialValue: T) {
    this._initialValue = initialValue
  }

  get initialValue(): T {
    return this._initialValue
  }

  stream<A, B, C, D, E, F, G, H, I, J>(
    act1: Action<T, A>,
    act2?: Action<A, B>,
    act3?: Action<B, C>,
    act4?: Action<C, D>,
    act5?: Action<D, E>,
    act6?: Action<E, F>,
    act7?: Action<F, G>,
    act8?: Action<G, H>,
    act9?: Action<H, I>,
    act10?: Action<I, J>
  ): Omit<this, 'stream'> {
    const _actions = [
      act1,
      act2,
      act3,
      act4,
      act5,
      act6,
      act7,
      act8,
      act9,
      act10,
    ].filter((act) => typeof act !== 'undefined') as Action<
      PromiseOr<any>,
      PromiseOr<any>
    >[]
    this._actions = _actions
    return this as Omit<this, 'stream'>
  }

  execute<T = any>(onError?: (error: any) => any): T {
    let result: any = this._initialValue
    try {
      result = this._execute()
    } catch (e) {
      if (onError) {
        onError(e)
      } else {
        console.error(e)
      }
    }

    return result
  }

  private _execute(): any {
    let result = this._initialValue
    this._actions.reduce((pre, curr) => {
      if (typeof pre === 'undefined') {
        return
      }
      const _result = curr(pre)
      result = _result
      return _result
    }, this._initialValue)
    return result
  }
}
