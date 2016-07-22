import test from 'ava'
import model from 'model'

const counter = model({
  namespace: 'counter',
  state: 0,
})

test('create model', t => {
  t.is(counter.getNamespace(), 'counter')
})

test('create action creator', t => {
  counter.action('increment')

  t.deepEqual(counter.increment(), { type: 'counter::increment', payload: undefined })
})

test('has default reducer', t => {
  const foo = model({
    namespace: 'foo',
    state: 1
  })

  t.is(foo.getReducer()(), 1)
})

test('create reducer', t => {
  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  })

  t.is(counter.getReducer(), reducer)
  t.is(reducer(undefined, { type: 'counter::increment' }), 1)
})

test('reducer enhancer', t => {
  const double = reducer => {
    return (state, action) => {
      state = reducer(state, action)
      return state * 2
    }
  }
  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  }, double)


  t.is(counter.getReducer(), reducer)
  t.is(reducer(undefined, { type: 'counter::increment' }), 2)
})
