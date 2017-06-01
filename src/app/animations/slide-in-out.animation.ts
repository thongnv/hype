import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOutAnimation', [
  state('out', style({
    opacity: 0,
    transform: 'translateX(100%)',
    display: 'none'
  })),
  state('in', style({
    opacity: 1,
    transform: 'translateX(0)',
  })),
  state('default', style({
    overflow: 'hidden',
    opacity: 1,
    transform: 'translateX(0)',
  })),
  state('hidden', style({
    opacity: 0,
    transform: 'translateX(110%)',
    height: 0,
    overflow: 'hidden',
  })),
  transition('out => in', animate('400ms ease-in')),
  transition('default => hidden', animate('200ms 400 ease-in')),
  transition('* => *', animate('400ms ease-in')),
]);
