import { BaseExecutor } from './__interfaces__'
import { Action, PromiseOr } from '../types'

export class AsyncChainExecutor<T> implements BaseExecutor {
  private _initialValue: T
  private _actions: Action<PromiseOr<any>, PromiseOr<any>>[] = []

  constructor(initialValue: T) {
    this._initialValue = initialValue
  }

  get initialValue(): T {
    return this._initialValue
  }

  stream<A, B, C, D, E, F, G, H, I, J>(
    act1: Action<Promise<T>, A>,
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

  async execute<T = any>(onError?: (error: any) => any): Promise<T> {
    let result: PromiseOr<any> = this._initialValue
    try {
      result = await this._promiseExecute()
    } catch (e) {
      if (onError) {
        onError(e)
      } else {
        console.error(e)
      }
    }

    return result
  }

  private async _promiseExecute(): Promise<any> {
    let result = this._initialValue
    await this._actions.reduce(
      async (pre, curr: Action<PromiseOr<any>, PromiseOr<any>>) => {
        if (pre instanceof Promise && typeof (await pre) === 'undefined') {
          return
        }

        const _result = await curr(pre)
        result = _result
        return _result
      },
      Promise.resolve(this._initialValue)
    )

    return result
  }
}
