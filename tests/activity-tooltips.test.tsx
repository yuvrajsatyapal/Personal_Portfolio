import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Heatmap from '../src/components/Heatmap';
describe('activity block tooltips',()=>{
 for(const [label,unit] of [['GitHub','contributions'],['LeetCode','submissions']]) {
  it(`shows the exact ${label} count and date`,()=>{
   render(<Heatmap calendar={{'2026-10-01':{count:19,level:4}}} label={label} end={new Date('2026-10-01T12:00:00Z')}/>);
   fireEvent.mouseEnter(screen.getByLabelText(`2026-10-01: 19 ${unit}`));
   expect(screen.getByRole('tooltip')).toHaveTextContent(`19 ${unit}`);
   expect(screen.getByRole('tooltip')).toHaveTextContent('October 1, 2026');
   fireEvent.keyDown(window,{key:'Escape'});
   expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
 }
 it('shows zero activity instead of leaving an empty tooltip',()=>{
  render(<Heatmap calendar={{}} label="GitHub" end={new Date('2026-10-01T12:00:00Z')}/>);
  fireEvent.mouseEnter(screen.getByLabelText('2026-10-01: 0 contributions'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('0 contributions');
 });
});
