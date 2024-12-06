import React from 'react';
import { render, act } from '@testing-library/react';
import { QueueProvider, useQueue } from '../components/QueueContext';
import Queue from '../Model/Queue';

// Create mock song functions
const createMockSong = () => ({
  hasInstrumental: jest.fn().mockReturnValue(false),
  StartAudioProcess: jest.fn().mockResolvedValue(true),
  pollTaskStatus: jest.fn().mockResolvedValue(true)
});

// Mock Queue class
class MockQueue {
  constructor() {
    this.songs = [];
  }

  getSongs() {
    return this.songs;
  }

  getNextSong() {
    return this.songs[0] || null;
  }

  addSong(song) {
    const mockSong = {
      ...song,
      ...createMockSong()
    };
    this.songs.push(mockSong);
  }

  removeSongFromQueue(index) {
    this.songs.splice(index, 1);
  }
}

// Mock the Queue class
jest.mock('../Model/Queue', () => {
  return jest.fn().mockImplementation(() => new MockQueue());
});

// Mock the SongFront class
jest.mock('../Model/SongFront', () => {
  return jest.fn().mockImplementation((data) => ({
    ...data,
    ...createMockSong()
  }));
});

describe('QueueContext', () => {
  let mockQueue;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueue = new MockQueue();
    Queue.mockImplementation(() => mockQueue);
  });

  const TestComponent = ({ onMount }) => {
    const contextValue = useQueue();
    React.useEffect(() => {
      if (onMount) onMount(contextValue);
    }, [onMount]);
    return null;
  };

  it('initializes with empty queue', async () => {
    let contextValue;
    await act(async () => {
      render(
        <QueueProvider>
          <TestComponent onMount={(value) => { contextValue = value; }} />
        </QueueProvider>
      );
    });

    expect(contextValue.queue).toBeDefined();
    expect(contextValue.queue.getSongs()).toHaveLength(0);
  });

  it('adds song to queue', async () => {
    let contextValue;
    const mockSong = {
      title: 'Test Song',
      artist: 'Test Artist'
    };

    await act(async () => {
      render(
        <QueueProvider>
          <TestComponent onMount={(value) => { contextValue = value; }} />
        </QueueProvider>
      );
    });

    await act(async () => {
      await contextValue.addSongToQueue(mockSong);
    });

    expect(contextValue.queue.getSongs()).toHaveLength(1);
    expect(contextValue.queue.getSongs()[0].title).toBe('Test Song');
  });

  it('removes song from queue', async () => {
    let contextValue;
    await act(async () => {
      render(
        <QueueProvider>
          <TestComponent onMount={(value) => { contextValue = value; }} />
        </QueueProvider>
      );
    });

    // Add a test song first
    await act(async () => {
      await contextValue.addSongToQueue({
        title: 'Test Song',
        artist: 'Test Artist'
      });
    });

    // Remove the song
    await act(async () => {
      await contextValue.removeSongFromQueue(0);
    });

    expect(contextValue.queue.getSongs()).toHaveLength(0);
  });

  it('processes songs correctly', async () => {
    let contextValue;
    await act(async () => {
      render(
        <QueueProvider>
          <TestComponent onMount={(value) => { contextValue = value; }} />
        </QueueProvider>
      );
    });

    const mockSong = {
      title: 'Test Song',
      artist: 'Test Artist'
    };

    await act(async () => {
      await contextValue.addSongToQueue(mockSong);
      // Wait for any effects to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const songs = contextValue.queue.getSongs();
    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe('Test Song');
  });
});