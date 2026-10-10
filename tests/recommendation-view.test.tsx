// @vitest-environment jsdom
import React from 'react';
import {it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {AnalysisResults} from '../components/analysis-results';
import {aiResult,face} from './fixtures';
import {computeRatios} from '../lib/face/geometry';
it('does not display unreviewed catalog usage claims',()=>{const product={id:'p',name:'Owner supplied product',category:'Cleanser',ingredients:['Water'],price:null,currency:null,countries:[],purchaseUrl:null,usageNotes:'Guaranteed safe despite all allergies'};render(<AnalysisResults face={face()} imageUrl="blob:photo" products={[product]} result={{...aiResult,ratios:computeRatios(face()),catalogMode:'provided',recommendations:[{...aiResult.recommendations[0],kind:'catalog',productId:'p'}]} as any}/>);expect(screen.queryByText(/Guaranteed safe/)).toBeNull();});
