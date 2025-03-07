import React from 'react';
import renderer from 'react-test-renderer';

import CompleteFlow from '../../navigation/CompleteFlow';

describe('<CompleteFlow />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<CompleteFlow />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});

it('renders correctly', () => {
  const tree = renderer.create(<CompleteFlow />).toJSON();
  expect(tree).toMatchSnapshot();
});