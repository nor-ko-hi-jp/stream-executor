import { Action } from '../types';
import { BaseExecutor } from './__interfaces__';
export declare class StreamExecutorFacade<T> {
    private _initialValue;
    constructor(initialValue: T);
    chain<A, B, C, D, E, F, G, H, I, J>(act1: Action<T, A>, act2?: Action<A, B>, act3?: Action<B, C>, act4?: Action<C, D>, act5?: Action<D, E>, act6?: Action<E, F>, act7?: Action<F, G>, act8?: Action<G, H>, act9?: Action<H, I>, act10?: Action<I, J>): BaseExecutor;
    parallel<A, B, C, D, E, F, G, H, I, J>(act1: Action<T, A>, act2?: Action<T, B>, act3?: Action<T, C>, act4?: Action<T, D>, act5?: Action<T, E>, act6?: Action<T, F>, act7?: Action<T, G>, act8?: Action<T, H>, act9?: Action<T, I>, act10?: Action<T, J>): BaseExecutor;
}
export declare const createStream: <T>(initialValue: T) => StreamExecutorFacade<T>;