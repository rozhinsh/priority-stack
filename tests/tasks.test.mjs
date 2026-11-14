import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultTasks, parseStoredTasks, reorderItems } from '../src/lib/tasks.ts';

test('reorderItems moves an item forward without mutating the original array', () => {
  const items = ['a', 'b', 'c'];
  assert.deepEqual(reorderItems(items, 0, 2), ['b', 'c', 'a']);
  assert.deepEqual(items, ['a', 'b', 'c']);
});
test('reorderItems moves an item backward', () => {
  assert.deepEqual(reorderItems(['a', 'b', 'c'], 2, 0), ['c', 'a', 'b']);
});
test('reorderItems safely ignores invalid indices', () => {
  const list = ['a', 'b'];
  assert.deepEqual(reorderItems(list, -1, 1), list);
  assert.deepEqual(reorderItems(list, 0, 10), list);
  assert.deepEqual(reorderItems(list, 0.2, 1), list);
});
test('parseStoredTasks accepts a valid list including an empty list', () => {
  assert.deepEqual(parseStoredTasks('[]'), []);
  const tasks = [{ id: 'a', title: 'A task', completed: false }];
  assert.deepEqual(parseStoredTasks(JSON.stringify(tasks)), tasks);
});
test('parseStoredTasks rejects malformed data and duplicate IDs', () => {
  assert.equal(parseStoredTasks('{oops'), null);
  assert.equal(parseStoredTasks('{}'), null);
  assert.equal(parseStoredTasks(JSON.stringify([{ id: 'a', title: 'A', completed: false }, { id: 'a', title: 'B', completed: false }])), null);
  assert.equal(parseStoredTasks(JSON.stringify([{ id: 'a', title: '', completed: false }])), null);
});
test('default tasks are fresh copies', () => {
  const first = getDefaultTasks();
  first[0].title = 'Changed';
  assert.notEqual(getDefaultTasks()[0].title, 'Changed');
});
