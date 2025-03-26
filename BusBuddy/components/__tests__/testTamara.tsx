import { render, screen, waitFor,cleanup } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import App from '../../app/(tabs)/index';


jest.mock('react-native-permissions', () => ({
  request: jest.fn().mockResolvedValue('granted'),
  check: jest.fn().mockResolvedValue('granted'),
}));

jest.mock('react-native-geolocation-service', () => ({
  getCurrentPosition: jest.fn().mockResolvedValue({
    coords: { latitude: 37.78825, longitude: -122.4324 },
  }),
}));

describe('App', () => {
  afterEach(() => {
    cleanup();  // cleans up after each test
  });

  it('renders MapView when region is set', async () => {
    await act(async () => {
      render(<App />);
    });

    //Function that waits for the mapview testing id to come through
    await waitFor(() => {
      expect(screen.getByTestId('mapview')).toBeTruthy();  
    });
  });

  it('shows an error when user does not allow for location permission', async () => {
    jest.mock('react-native-permissions', () => ({
      request: jest.fn().mockResolvedValue('denied'),
      check: jest.fn().mockResolvedValue('denied'),
    }));

    await act(async () => {
      render(<App />);
    });

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByText('Permission to access location was denied');
      expect(errorMessage).toBeTruthy(); 
    });
  });
});