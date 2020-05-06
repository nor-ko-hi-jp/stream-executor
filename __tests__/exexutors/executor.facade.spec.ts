import { createStream, tap } from '../../src/executors'
import { ChainExecutor } from '../../src/executors/chain.executor'
import { BatchExecutor } from '../../src/executors/batch.executor'
import { deepCopy } from '../../src/utils'
import { BaseExecutor } from '../../src/executors/__interfaces__'

describe('StreamExecutorFacade', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('ChainExecutor called', () => {
    const executor = createStream(1).chain((_) => 10)
    const result = executor.execute()

    expect(result).toEqual(10)
    expect(executor).toBeInstanceOf(ChainExecutor)
  })

  it('ParallelExecutor called', () => {
    let num = 0
    const executor = createStream(1).batch((it) => {
      num = it
    })
    executor.execute()

    expect(num).toEqual(1)
    expect(executor).toBeInstanceOf(BatchExecutor)
  })

  it('do deepCopy', () => {
    const input = { value: 1, fruitNames: ['pine', 'apple'] }
    const executor = createStream(deepCopy(input)).chain(
      tap((it) => {
        it.value += 9
        it.fruitNames.push('orange')
      })
    )
    const result = executor.execute()

    expect(result.value).toEqual(10)
    expect(result.fruitNames.length).toEqual(3)

    expect(input.value).toEqual(1)
    expect(input.fruitNames.length).toEqual(2)
  })

  it('do not deepCopy', () => {
    const input = { value: 1, fruitNames: ['pine', 'apple'] }
    const executor = createStream(input).chain(
      tap((it) => {
        it.value += 9
        it.fruitNames.push('orange')
      })
    )
    const result = executor.execute()

    expect(result.value).toEqual(10)
    expect(result.fruitNames.length).toEqual(3)

    expect(input.value).toEqual(10)
    expect(input.fruitNames.length).toEqual(3)
  })

  it('replace Chain and Batch Executor', () => {
    const spyConsole = jest.spyOn(console, 'log')
    class MockChainExecutor implements BaseExecutor {
      stream(...args: any[]) {
        return this
      }
      execute() {
        console.log('MockChainExecutor called')
      }
    }

    class MockBatchExecutor implements BaseExecutor {
      stream(...args: any[]) {
        return this
      }
      execute() {
        console.log('MockBatchExecutor called')
      }
    }
    const facade = createStream(1, {
      chainClass: MockChainExecutor,
      batchClass: MockBatchExecutor,
    })

    facade.chain((it) => it).execute()
    expect(spyConsole.mock.calls[0][0]).toEqual('MockChainExecutor called')

    facade.batch((it) => it).execute()
    expect(spyConsole.mock.calls[1][0]).toEqual('MockBatchExecutor called')
  })
})
