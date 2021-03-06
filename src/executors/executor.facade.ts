import { Action, PromiseOr } from '../types'
import { ChainExecutor } from './chain.executor'
import { AsyncChainExecutor } from './async-chain.executor'
import { BatchExecutor } from './batch.executor'
import { Constructor, BaseExecutor } from './__interfaces__'

export class StreamExecutorFacade<T> {
  private _initialValue: T
  private _chainClass: Constructor<BaseExecutor>
  private _batchClass: Constructor<BaseExecutor>
  private _asyncChainClass: Constructor<BaseExecutor>

  constructor(
    initialValue: T,
    option: {
      chainClass?: Constructor<BaseExecutor>
      batchClass?: Constructor<BaseExecutor>
      asyncChainClass?: Constructor<BaseExecutor>
    }
  ) {
    this._initialValue = initialValue
    this._chainClass = option.chainClass ? option.chainClass : ChainExecutor
    this._batchClass = option.batchClass ? option.batchClass : BatchExecutor
    this._asyncChainClass = option.asyncChainClass
      ? option.asyncChainClass
      : AsyncChainExecutor
  }

  /**
   * sequential asynchronous execution.
   * @see https://github.com/nor-ko-hi-jp/stream-executor/blob/master/README.md#using-stream-executor-2
   * @param act1 (value: Promise<T>) => U
   * @param act2 (value: T) => U
   * @param act3 (value: T) => U
   * @param act4 (value: T) => U
   * @param act5 (value: T) => U
   * @param act6 (value: T) => U
   * @param act7 (value: T) => U
   * @param act8 (value: T) => U
   * @param act9 (value: T) => U
   * @param act10 (value: T) => U
   */
  asyncChain<A, B, C, D, E, F, G, H, I, J>(
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
  ) {
    const executor = this._create('asyncChain', this._initialValue).stream(
      act1 as Action<PromiseOr<any>, PromiseOr<any>>,
      act2 as Action<PromiseOr<any>, PromiseOr<any>>,
      act3 as Action<PromiseOr<any>, PromiseOr<any>>,
      act4 as Action<PromiseOr<any>, PromiseOr<any>>,
      act5 as Action<PromiseOr<any>, PromiseOr<any>>,
      act6 as Action<PromiseOr<any>, PromiseOr<any>>,
      act7 as Action<PromiseOr<any>, PromiseOr<any>>,
      act8 as Action<PromiseOr<any>, PromiseOr<any>>,
      act9 as Action<PromiseOr<any>, PromiseOr<any>>,
      act10 as Action<PromiseOr<any>, PromiseOr<any>>
    )

    return executor as Omit<AsyncChainExecutor<T>, 'stream'>
  }

  /**
   * sequential execute.
   * use `createStream().asyncChain()` if you'd like to do asynchronous execution
   * @see https://github.com/nor-ko-hi-jp/stream-executor/blob/master/README.md#using-stream-executor
   * @param act1 (value: T) => U
   * @param act2 (value: T) => U
   * @param act3 (value: T) => U
   * @param act4 (value: T) => U
   * @param act5 (value: T) => U
   * @param act6 (value: T) => U
   * @param act7 (value: T) => U
   * @param act8 (value: T) => U
   * @param act9 (value: T) => U
   * @param act10 (value: T) => U
   */
  chain<A, B, C, D, E, F, G, H, I, J>(
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
  ) {
    const executor = this._create('chain', this._initialValue).stream(
      act1 as Action<PromiseOr<any>, PromiseOr<any>>,
      act2 as Action<PromiseOr<any>, PromiseOr<any>>,
      act3 as Action<PromiseOr<any>, PromiseOr<any>>,
      act4 as Action<PromiseOr<any>, PromiseOr<any>>,
      act5 as Action<PromiseOr<any>, PromiseOr<any>>,
      act6 as Action<PromiseOr<any>, PromiseOr<any>>,
      act7 as Action<PromiseOr<any>, PromiseOr<any>>,
      act8 as Action<PromiseOr<any>, PromiseOr<any>>,
      act9 as Action<PromiseOr<any>, PromiseOr<any>>,
      act10 as Action<PromiseOr<any>, PromiseOr<any>>
    )

    return executor as Omit<ChainExecutor<T>, 'stream'>
  }

  /**
   * batch execute, like `when` in Kotlin.
   * @see https://github.com/nor-ko-hi-jp/stream-executor/blob/master/README.md#using-stream-executor-1
   * @param act1 (value: T) => U
   * @param act2 (value: T) => U
   * @param act3 (value: T) => U
   * @param act4 (value: T) => U
   * @param act5 (value: T) => U
   * @param act6 (value: T) => U
   * @param act7 (value: T) => U
   * @param act8 (value: T) => U
   * @param act9 (value: T) => U
   * @param act10 (value: T) => U
   */
  batch<A, B, C, D, E, F, G, H, I, J>(
    act1: Action<T, A>,
    act2?: Action<T, B>,
    act3?: Action<T, C>,
    act4?: Action<T, D>,
    act5?: Action<T, E>,
    act6?: Action<T, F>,
    act7?: Action<T, G>,
    act8?: Action<T, H>,
    act9?: Action<T, I>,
    act10?: Action<T, J>
  ) {
    const executor = this._create('batch', this._initialValue).stream(
      act1,
      act2,
      act3,
      act4,
      act5,
      act6,
      act7,
      act8,
      act9,
      act10
    )

    return executor as Pick<BatchExecutor<T>, 'execute'>
  }

  private _create(
    type: 'chain' | 'batch' | 'asyncChain',
    ...args: any[]
  ): BaseExecutor {
    switch (type) {
      case 'chain':
        return new this._chainClass(...args)
      case 'batch':
        return new this._batchClass(...args)
      default:
        return new this._asyncChainClass(...args)
    }
  }
}

/**
 * create streamer, initialValue is shallow copied.
 *
 *
 * Use `deepCopy` in this library if you'd like to do deep copy.
 *
 *
 * Set `option.chainClass` or `option.batchClass` if you would change execution process.
 *   - https://github.com/nor-ko-hi-jp/stream-executor/blob/master/README.md#5-replace-chain-or-batch-executor
 * @param initialValue T
 * @param option: { chainClass?: { new (...args: any[]): BaseExecutor }, batchClass?: { new (...args: any[]): BaseExecutor } }
 */
export const createStream = <T>(
  initialValue: T,
  option: {
    chainClass?: Constructor<BaseExecutor>
    batchClass?: Constructor<BaseExecutor>
  } = {}
) => new StreamExecutorFacade(initialValue, option)
