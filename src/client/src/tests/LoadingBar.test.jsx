import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SongLoadingBar from '../components/LoadingBar';
import { QueueProvider } from '../components/QueueContext';

// Mock the useQueue hook
jest.mock('../components/QueueContext', () => ({
  useQueue: () => ({
    getNextSong: jest.fn(),
  }),
  QueueProvider: ({ children }) => <div>{children}</div>
}));

describe('LoadingBar Component', () => {
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    image_url: 'test-url.jpg',
    progress: 0,
  };

  const renderWithProvider = (ui) => {
    return render(
      <QueueProvider>
        {ui}
      </QueueProvider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider(<SongLoadingBar song={mockSong} />);
  });
});