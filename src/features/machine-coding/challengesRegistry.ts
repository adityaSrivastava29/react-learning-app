import React from 'react';
import { TodoListChallenge } from './easy/todo-list/TodoListChallenge';
import { CounterChallenge } from './easy/counter/CounterChallenge';
import { AccordionChallenge } from './easy/accordion/AccordionChallenge';
import { TabsChallenge } from './easy/tabs/TabsChallenge';
import { StarRatingChallenge } from './easy/star-rating/StarRatingChallenge';
import { ModalChallenge } from './easy/modal/ModalChallenge';
import { PaginationChallenge } from './easy/pagination/PaginationChallenge';
import { CarouselChallenge } from './easy/carousel/CarouselChallenge';
import { OtpInputChallenge } from './easy/otp-input/OtpInputChallenge';
import { TrafficLightChallenge } from './easy/traffic-light/TrafficLightChallenge';
import { ChipsInputChallenge } from './easy/chipsInput/chipsInputChallenge';

import { SearchableListChallenge } from './medium/searchable-list/SearchableListChallenge';
import { DebouncedSearchChallenge } from './medium/debounced-search/DebouncedSearchChallenge';
import { AutocompleteChallenge } from './medium/autocomplete/AutocompleteChallenge';
import { TodoLocalStorageChallenge } from './medium/todo-localstorage/TodoLocalStorageChallenge';
import { ShoppingCartChallenge } from './medium/shopping-cart/ShoppingCartChallenge';
import { MultiSelectChallenge } from './medium/multiselect/MultiSelectChallenge';
import { DynamicFormChallenge } from './medium/dynamic-form/DynamicFormChallenge';
import { FileUploadChallenge } from './medium/file-upload/FileUploadChallenge';
import { ToastNotificationChallenge } from './medium/toast-notification/ToastNotificationChallenge';
import { CountdownTimerChallenge } from './medium/countdown-timer/CountdownTimerChallenge';

export interface MachineCodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium';
  estimatedTime: string;
  description: string;
  folderPath: string;
  component: React.ComponentType;
  requirements: string[];
  tags: string[];
}

export const machineCodingChallenges: MachineCodingChallenge[] = [
  // EASY
  {
    id: 'todo-list',
    title: 'Todo List',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build a standard React Todo application supporting item addition, deletion, toggle complete, and status filtering.',
    folderPath: 'src/features/machine-coding/easy/todo-list',
    component: TodoListChallenge,
    requirements: [
      'Add new task with input validation',
      'Delete task',
      'Toggle completed status',
      'Filter tasks (All, Active, Completed)'
    ],
    tags: ['state', 'crud', 'filtering', 'inputs']
  },
  {
    id: 'counter',
    title: 'Counter',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build a flexible counter component with configurable step increments, decrements, and reset functionality.',
    folderPath: 'src/features/machine-coding/easy/counter',
    component: CounterChallenge,
    requirements: [
      'Increment & Decrement buttons',
      'Reset counter to initial value',
      'Custom step value modifier input'
    ],
    tags: ['state', 'counter', 'inputs']
  },
  {
    id: 'accordion',
    title: 'Accordion',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Create an accessible accordion component supporting both single-open and multi-open panel modes.',
    folderPath: 'src/features/machine-coding/easy/accordion',
    component: AccordionChallenge,
    requirements: [
      'Expand and collapse sections',
      'Toggle mode: Single active panel vs. Multiple active panels',
      'Smooth state transitions'
    ],
    tags: ['accordion', 'toggle', 'ui-components']
  },
  {
    id: 'tabs',
    title: 'Tabs',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build a tabs component capable of managing active state and dynamically adding new tab panels at runtime.',
    folderPath: 'src/features/machine-coding/easy/tabs',
    component: TabsChallenge,
    requirements: [
      'Active tab selection and panel rendering',
      'Dynamically add new custom tabs',
      'Closeable tabs'
    ],
    tags: ['tabs', 'dynamic-ui', 'navigation']
  },
  {
    id: 'star-rating',
    title: 'Star Rating',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Implement an interactive 5-star rating widget supporting hover preview, click selection, and read-only mode.',
    folderPath: 'src/features/machine-coding/easy/star-rating',
    component: StarRatingChallenge,
    requirements: [
      'Hover star preview highlight',
      'Click to lock rating',
      'Read-only display mode toggle'
    ],
    tags: ['rating', 'events', 'hover']
  },
  {
    id: 'modal',
    title: 'Modal Dialog',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build an overlay modal component that can be closed via trigger button, pressing Escape, or clicking backdrop.',
    folderPath: 'src/features/machine-coding/easy/modal',
    component: ModalChallenge,
    requirements: [
      'Open and close modal actions',
      'Close on Escape (ESC) keypress listener',
      'Close on clicking backdrop (outside container)'
    ],
    tags: ['modal', 'keyboard-events', 'portal', 'overlay']
  },
  {
    id: 'pagination',
    title: 'Pagination',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Create a paginated item view with page navigation buttons, direct page jump, and customizable page size.',
    folderPath: 'src/features/machine-coding/easy/pagination',
    component: PaginationChallenge,
    requirements: [
      'Previous / Next page navigation',
      'Direct page number click',
      'Dynamic page size selector (5, 10, 20 items per page)'
    ],
    tags: ['pagination', 'data-slicing', 'ui']
  },
  {
    id: 'carousel',
    title: 'Image Carousel',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build a responsive image slider with manual navigation controls, dynamic indicators, and optional auto-play playback.',
    folderPath: 'src/features/machine-coding/easy/carousel',
    component: CarouselChallenge,
    requirements: [
      'Next & Previous slide controls',
      'Auto-play slider with configurable interval timer',
      'Bottom dot navigation indicators'
    ],
    tags: ['carousel', 'timer', 'media', 'slider']
  },
  {
    id: 'otp-input',
    title: 'OTP Input',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Construct a multi-box digit input field supporting auto-focus shift on typing, backspace navigation, and validation submit.',
    folderPath: 'src/features/machine-coding/easy/otp-input',
    component: OtpInputChallenge,
    requirements: [
      'Multiple isolated digit boxes',
      'Automatic auto-focus progression to next box on entry',
      'Backspace navigation to previous box',
      'Validation trigger on completion'
    ],
    tags: ['forms', 'focus-management', 'inputs', 'auth']
  },
  {
    id: 'traffic-light',
    title: 'Traffic Light',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build an automated traffic light controller simulating real-world sequence timing with pause and manual override controls.',
    folderPath: 'src/features/machine-coding/easy/traffic-light',
    component: TrafficLightChallenge,
    requirements: [
      'Automatic state transition (Red 4s -> Green 3s -> Yellow 2s)',
      'Start / Stop playback toggle',
      'Manual light override trigger'
    ],
    tags: ['state-machine', 'timer', 'useEffect', 'simulation']
  },
  {
    id: 'chips-input',
    title: 'Chips Input',
    difficulty: 'Easy',
    estimatedTime: '20–30 min',
    description: 'Build an interactive tag/chips input component where users can add chips on pressing Enter, remove chips, and toggle active state.',
    folderPath: 'src/features/machine-coding/easy/chipsInput',
    component: ChipsInputChallenge,
    requirements: [
      'Type text and press Enter to append new chip',
      'Click chip to toggle active state',
      'Click remove (✕) button to delete chip',
      'Prevent duplicate or empty whitespace chips'
    ],
    tags: ['chips', 'tags', 'keyboard-events', 'inputs']
  },

  // MEDIUM
  {
    id: 'searchable-list',
    title: 'Searchable User List',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build an interactive user directory filtered instantly across multiple record attributes (name, email, role).',
    folderPath: 'src/features/machine-coding/medium/searchable-list',
    component: SearchableListChallenge,
    requirements: [
      'Live search filter input',
      'Filter across multi-attribute user data fields',
      'Display user details with highlighted match counts'
    ],
    tags: ['filtering', 'search', 'user-list']
  },
  {
    id: 'debounced-search',
    title: 'Debounced Search',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Implement a debounced input mechanism delaying API requests by 500ms to avoid unnecessary server calls.',
    folderPath: 'src/features/machine-coding/medium/debounced-search',
    component: DebouncedSearchChallenge,
    requirements: [
      'Delay query dispatch by 500ms using custom debounce logic',
      'Show simulated server query logs with network latency',
      'Clear pending timers on continuous typing'
    ],
    tags: ['debounce', 'performance', 'useEffect', 'hooks']
  },
  {
    id: 'autocomplete',
    title: 'Autocomplete Search',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build a Google-style autocomplete dropdown with debounced network calls, loading spinners, and empty fallback state.',
    folderPath: 'src/features/machine-coding/medium/autocomplete',
    component: AutocompleteChallenge,
    requirements: [
      'Debounced user input search',
      'Loading indicator during query resolution',
      'Dropdown suggestions with item selection click',
      'Empty state feedback when no matches are found'
    ],
    tags: ['autocomplete', 'combobox', 'async', 'dropdown']
  },
  {
    id: 'todo-localstorage',
    title: 'Todo with LocalStorage',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build a durable todo application persisting item state, completion status, and filter preferences in browser window.localStorage.',
    folderPath: 'src/features/machine-coding/medium/todo-localstorage',
    component: TodoLocalStorageChallenge,
    requirements: [
      'Add, toggle, and delete todo items',
      'Automatic state sync to LocalStorage',
      'Data retention across page reloads & browser restarts',
      'Clear storage action button'
    ],
    tags: ['localstorage', 'persistence', 'state', 'crud']
  },
  {
    id: 'shopping-cart',
    title: 'Shopping Cart',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Develop an e-commerce shopping cart management system calculating line item subtotals, quantity adjustments, and global totals.',
    folderPath: 'src/features/machine-coding/medium/shopping-cart',
    component: ShoppingCartChallenge,
    requirements: [
      'Catalog view to add items to cart',
      'Increase / Decrease item quantities in cart',
      'Remove items and calculate subtotal & total cost dynamically'
    ],
    tags: ['e-commerce', 'cart', 'state-management', 'calculations']
  },
  {
    id: 'multiselect',
    title: 'Multi-select Dropdown',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Construct a multi-select dropdown featuring inline option searching, "Select All" toggle, and selected tag pills.',
    folderPath: 'src/features/machine-coding/medium/multiselect',
    component: MultiSelectChallenge,
    requirements: [
      'Select / Unselect multiple dropdown items',
      'Select All / Deselect All trigger',
      'Search input filter within dropdown options menu',
      'Removable selected pill badges'
    ],
    tags: ['dropdown', 'select', 'forms', 'multi-select']
  },
  {
    id: 'dynamic-form',
    title: 'Dynamic Form Generator',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Render fully functional, validated dynamic forms derived dynamically from JSON field schema configurations.',
    folderPath: 'src/features/machine-coding/medium/dynamic-form',
    component: DynamicFormChallenge,
    requirements: [
      'Accept JSON schema input array',
      'Dynamically render input text, email, select, checkbox, and textareas',
      'Capture and submit form state dynamically as JSON output'
    ],
    tags: ['dynamic-form', 'json-schema', 'forms', 'inputs']
  },
  {
    id: 'file-upload',
    title: 'File Upload & Progress',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build a file uploader component with drag-and-drop support, type/size validation, and animated simulated upload progress.',
    folderPath: 'src/features/machine-coding/medium/file-upload',
    component: FileUploadChallenge,
    requirements: [
      'Select or Drag & Drop file attachment',
      'Validate file size limit (<5MB) and mime types',
      'Simulate upload progress bar (0% -> 100%)',
      'Cancel or remove uploaded file'
    ],
    tags: ['file-upload', 'drag-drop', 'progress', 'validation']
  },
  {
    id: 'toast-notification',
    title: 'Toast Notification System',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build an imperative toast notification manager supporting context alerts (success, error, info, warning) with auto-dismiss timers.',
    folderPath: 'src/features/machine-coding/medium/toast-notification',
    component: ToastNotificationChallenge,
    requirements: [
      'Imperative function triggers: toast.success(), toast.error(), toast.info()',
      'Auto-dismiss notification after 3 seconds',
      'Manual close button and stackable notification list'
    ],
    tags: ['toast', 'notifications', 'context', 'timers']
  },
  {
    id: 'countdown-timer',
    title: 'Countdown Timer',
    difficulty: 'Medium',
    estimatedTime: '30–40 min',
    description: 'Build a precise countdown timer supporting hours, minutes, and seconds input with play, pause, resume, and alarm finish actions.',
    folderPath: 'src/features/machine-coding/medium/countdown-timer',
    component: CountdownTimerChallenge,
    requirements: [
      'Custom hours, minutes, seconds input setup',
      'Start, Pause, Resume, and Reset controls',
      'Visual progress ring and alert completion banner'
    ],
    tags: ['timer', 'countdown', 'setInterval', 'time-math']
  }
];
