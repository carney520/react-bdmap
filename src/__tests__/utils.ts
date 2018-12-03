import * as utils from '../utils'

test('time delay', () => {
  jest.useFakeTimers()
  const time = 1000
  const fn = jest.fn()
  const promise = utils.delay(time).then(fn)
  jest.advanceTimersByTime(300)
  expect(fn).not.toBeCalled()
  jest.advanceTimersByTime(time)
  return expect(promise).resolves.toBe(undefined)
})

test('method override', () => {
  const propsMethodName = 'onMock'
  const callback = jest.fn()
  const overridedMethod = utils.override(propsMethodName, callback)
  const args = [1, 2, 3]
  const mockProps = {
    props: {
      [propsMethodName]: jest.fn(),
    },
  }
  overridedMethod.apply(mockProps, args)

  expect(callback).toBeCalledWith(...args)
  expect(mockProps.props[propsMethodName]).toBeCalledWith(...args)
})

/**
 * settable 属性
 */
describe('settable properties', () => {
  describe('Baidu Map object has equals', () => {
    test.each`
      input                   | expected
      ${1}                    | ${false}
      ${'string'}             | ${false}
      ${{}}                   | ${false}
      ${[]}                   | ${false}
      ${{ equals: true }}     | ${false}
      ${{ equals: () => {} }} | ${true}
    `('expect hasEquals($input) to be $expected', ({ input, expected }) => {
      expect(utils.hasEquals(input)).toBe(expected)
    })
  })

  describe('settable property equals', () => {
    const MockPoint = class {
      constructor(private a: number, private b: number) {}
      equals(point: any) {
        if (point == null) {
          return false
        }
        return this.a == point.a && this.b == point.b
      }
    }

    test.each`
      val1                                                  | val2                                                  | expected
      ${1}                                                  | ${1}                                                  | ${true}
      ${[]}                                                 | ${[]}                                                 | ${true}
      ${{}}                                                 | ${{}}                                                 | ${true}
      ${{ a: 1, b: 2 }}                                     | ${{ b: 2, a: 1 }}                                     | ${true}
      ${new MockPoint(1, 2)}                                | ${new MockPoint(1, 2)}                                | ${true}
      ${new MockPoint(2, 1)}                                | ${new MockPoint(1, 2)}                                | ${false}
      ${[new MockPoint(1, 2)]}                              | ${[new MockPoint(1, 2)]}                              | ${true}
      ${{ a: new MockPoint(1, 2), b: new MockPoint(2, 1) }} | ${{ b: new MockPoint(2, 1), a: new MockPoint(1, 2) }} | ${true}
    `('expect settableEquals($val1, $val2) to be $expected', ({ val1, val2, expected }) => {
      expect(utils.settableEquals(val1, val2)).toBe(expected)
    })
  })

  test('initializeSettableProperties', () => {
    const instance = {
      setFoo: jest.fn(),
      setBar: jest.fn(),
      setBaz: jest.fn(),
      setBazz: jest.fn(),
    }
    const properties = ['foo', 'bar']
    const props = { foo: 'value', bar: 'value2', bazz: 'value3' }
    utils.initializeSettableProperties(properties, instance, props)

    expect(instance.setFoo).toBeCalledWith('value')
    expect(instance.setBar).toBeCalledWith('value2')
    expect(instance.setBaz).not.toBeCalled()
    expect(instance.setBazz).not.toBeCalled()
  })
})

/**
 * enableable 属性
 */
describe('enableable properties', () => {
  test('initializeEnableableProperties', () => {
    const instance = {
      enableFoo: jest.fn(),
      disableFoo: jest.fn(),
      enableBar: jest.fn(),
      disableBar: jest.fn(),
      enableBaz: jest.fn(),
      disableBaz: jest.fn(),
    }
    const properties = ['foo', 'bar', 'baz']
    const props = { enableFoo: true, enableBar: false }
    utils.initializeEnableableProperties(properties, instance, props)

    expect(instance.enableFoo).toBeCalled()
    expect(instance.disableFoo).not.toBeCalled()
    expect(instance.enableBar).not.toBeCalled()
    expect(instance.disableBar).toBeCalled()
    expect(instance.enableBaz).not.toBeCalled()
    expect(instance.disableBaz).not.toBeCalled()
  })
})

/**
 * 事件
 */
describe('events', () => {
  test.each`
    name         | expected
    ${'foo_bar'} | ${'onfoobar'}
    ${'foobar'}  | ${'onfoobar'}
    ${'foo_Bar'} | ${'onfooBar'}
    ${'Foo_bar'} | ${'onFoobar'}
  `('baidu eventName transform: getBDEventHandleName($name) to Be $expected', ({ name, expected }) => {
    expect(utils.getBDEventHandleName(name)).toBe(expected)
  })

  test.each`
    name         | expected
    ${'foo_bar'} | ${'FooBar'}
    ${'fooBar'}  | ${'FooBar'}
    ${'dbl_foo'} | ${'DoubleFoo'}
  `('normalize eventName: getPropsEventHandleName($name) to be $expected', ({ name, expected }) => {
    expect(utils.getPropsEventHandleName(name)).toBe(expected)
  })

  const events = ['foo_bar', 'dbl_foo', 'fooBaz', 'foo_bazz']
  const props = { onFooBar: () => 1, onDoubleFoo: () => 2, onFooBaz: () => 3 }

  test('initializeEvents name normalize', () => {
    const instance = {}

    utils.initializeEvents(events, instance, props)
    events.forEach(event => {
      expect(instance).toHaveProperty(
        utils.getBDEventHandleName(event),
        props[`on${utils.getPropsEventHandleName(event)}`],
      )
    })
  })

  test('initializeEvents with override', () => {
    const instance = {}
    const context = {
      handleFooBar: jest.fn(),
      handleDoubleFoo: jest.fn(),
    }
    utils.initializeEvents(events, instance, props, context)

    const overrideByContext = events.slice(0, 2)
    const noOverrided = events.slice(2)
    console.log(overrideByContext)
    overrideByContext.forEach(event => {
      const eventName = utils.getBDEventHandleName(event)
      expect(instance).toHaveProperty(eventName)
      const handleName = `handle${utils.getPropsEventHandleName(event)}`
      const args = {}
      instance[eventName](args)
      expect(context[handleName]).toBeCalledWith(args)
      expect((context[handleName] as jest.Mock).mock.instances[0]).toBe(context)
    })

    noOverrided.forEach(event => {
      expect(instance).toHaveProperty(
        utils.getBDEventHandleName(event),
        props[`on${utils.getPropsEventHandleName(event)}`],
      )
    })
  })
})
