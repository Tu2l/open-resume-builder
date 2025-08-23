'use client';
/**
 * Defines the possible states of the application UI.
 */


export type AppState = { step: 'welcome'; } |
{ step: 'template'; } |
{ step: 'form'; currentFormStep: number; } |
{ step: 'result'; jobDescription?: string; analysis?: string; };
