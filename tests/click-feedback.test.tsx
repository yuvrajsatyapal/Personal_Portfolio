import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ClickFeedback from '../src/components/ClickFeedback';
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
function setup(reduced=false){
 const play=vi.fn(()=>Promise.resolve());const pause=vi.fn();
 const audio={play,pause,volume:0,currentTime:0,preload:''};
 vi.stubGlobal('Audio',vi.fn(function(){return audio;}));
 vi.stubGlobal('matchMedia',vi.fn(()=>({matches:reduced})));
 render(<><ClickFeedback/><button>Action</button><button data-click-feedback="off">Theme<svg data-testid="theme-icon"><path /></svg></button></>);
 return audio;
}
describe('reference click feedback',()=>{
 it('stops pointer sound and clears sparks for excluded controls including SVG children',()=>{
  const audio=setup();
  fireEvent.click(screen.getByText('Action'));
  expect(audio.play).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByTestId('theme-icon'));
  expect(audio.play).toHaveBeenCalledOnce();
  expect(audio.pause).toHaveBeenCalledOnce();
  expect(document.querySelector('.click-spark-burst')).toBeNull();
  fireEvent.click(screen.getByText('Theme'),{detail:0});
  expect(audio.play).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByText('Action'));
  expect(audio.play).toHaveBeenCalledTimes(2);
 });
 it('plays quiet audio and removes its spark burst after half a second',()=>{
  vi.useFakeTimers();const audio=setup();
  fireEvent.click(screen.getByText('Action'),{clientX:120,clientY:80,detail:1});
  expect(audio.play).toHaveBeenCalledOnce();expect(audio.volume).toBe(.3);
  expect(document.querySelectorAll('.click-spark-ray')).toHaveLength(12);
  expect(document.querySelector('.click-spark-burst')).toHaveStyle({left:'120px',top:'80px'});
  act(()=>vi.advanceTimersByTime(500));
  expect(document.querySelector('.click-spark-burst')).toBeNull();
 });
 it('uses the control center for keyboard clicks',()=>{
  setup();const button=screen.getByText('Action');
  vi.spyOn(button,'getBoundingClientRect').mockReturnValue({left:100,top:40,width:80,height:30} as DOMRect);
  fireEvent.click(button,{detail:0});
  expect(document.querySelector('.click-spark-burst')).toHaveStyle({left:'140px',top:'55px'});
 });
 it('keeps audio but suppresses animation with reduced motion',()=>{
  const audio=setup(true);fireEvent.click(screen.getByText('Action'));
  expect(audio.play).toHaveBeenCalledOnce();expect(document.querySelector('.click-spark-burst')).toBeNull();
 });
});
