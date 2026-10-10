// @vitest-environment jsdom
import React from 'react';
import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {ProgressCards} from '../components/progress-cards';
import {createCheckIn,saveCheckIn,readCheckIns,PROGRESS_KEY,type CardData} from '../lib/progress';
import {computeRatios} from '../lib/face/geometry';
import {face} from './fixtures';

afterEach(()=>{cleanup();localStorage.clear();vi.restoreAllMocks();vi.unstubAllGlobals();});
it('never saves automatically, requires deliberate save, and clears history on request',async()=>{
  render(<ProgressCards result={{ratios:computeRatios(face())} as any}/>);
  expect(localStorage.getItem(PROGRESS_KEY)).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'Save this check-in'}));
  await screen.findByRole('button',{name:'Check-in saved'});
  expect(readCheckIns(localStorage)).toHaveLength(1);
  expect(screen.getByRole('button',{name:'Check-in saved'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button',{name:'Clear saved check-ins'}));
  expect(readCheckIns(localStorage)).toEqual([]);
});
it('requires two check-ins and previews only selected measurements before export',async()=>{
  const ratios=computeRatios(face());
  for(const [id,date] of [['one','2026-10-01'],['two','2026-10-09']]) saveCheckIn(localStorage,createCheckIn({ratios} as any,`${date}T12:00:00.000Z`,id));
  const renderCard=vi.fn(async(_data:CardData)=>new Blob(['png'],{type:'image/png'}));
  vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:preview'),revokeObjectURL:vi.fn()});
  render(<ProgressCards renderCard={renderCard}/>);
  expect(screen.queryByRole('button',{name:'Download card'})).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Mouth width / face width'));
  fireEvent.click(screen.getByRole('button',{name:'Preview my progress card'}));
  await screen.findByAltText('Your glowup progress card');
  expect(renderCard.mock.calls[0][0].rows).toHaveLength(2);
  expect(screen.getByRole('button',{name:'Download card'})).toBeEnabled();
  Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});
  fireEvent.click(screen.getByRole('button',{name:'Share card'}));
  await screen.findByText(/File sharing is unavailable/);
  fireEvent.click(screen.getByLabelText('Inner eye gap / face width'));
  expect(screen.queryByAltText('Your glowup progress card')).not.toBeInTheDocument();
});
