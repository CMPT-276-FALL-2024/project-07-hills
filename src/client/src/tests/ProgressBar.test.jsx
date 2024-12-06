import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../components/ProgressBar';
import { QueueProvider } from '../components/QueueContext';

// Mock the useQueue hook
jest.mock('../components/QueueContext', () => ({
  useQueue: () => ({
    queue: [],
    removeSongFromQueue: jest.fn(),
    addSongToQueue: jest.fn(),
    getNextSong: jest.fn(),
  }),
  QueueProvider: ({ children }) => <div>{children}</div>
}));

describe('ProgressBar Component', () => {
  const renderWithProvider = (ui) => {
    return render(
      <QueueProvider>
        {ui}
      </QueueProvider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider(<ProgressBar />);
  });
});