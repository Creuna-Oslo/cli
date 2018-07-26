import test from 'ava';
import cl from './source/commands/command-list';

test('serial', async t => {
  const funcs = [
    () => Promise.resolve(1),
    () => Promise.resolve(2),
    () => Promise.resolve(3),
    () => Promise.resolve(4)
  ];
  return cl.serial(funcs).then(r => t.deepEqual(r, [1, 2, 3, 4]));
});

test('serialempty', async t => {
  const funcs = [];
  return cl.serial(funcs).then(r => t.deepEqual(r, []));
});

test('justValues', async t => {
  const values = [{ foo: 1 }, { bar: 2 }];
  t.deepEqual(cl.justValues(values), [1, 2]);
});

test('supportedCommands', async t => {
  t.deepEqual(Object.keys(cl.supportedCommands), [
    'new',
    'lib',
    'component',
    'page',
    'rename',
    'stateful',
    'stateless',
    'applyForJob'
  ]);
});
