import React from 'react';
import { render, act} from '@testing-library/react-native';
import App  from '../../app/(tabs)/index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Initialize the mock adapter for axios
const mock = new MockAdapter(axios);

describe('fetchStops', () => {
  it('fetches bus stops correctly when region changes', async () => {
    // Mock data to return from the API
    const mockStops = [
      {
        id: '1',
        stop_id: 123,
        stop_name: 'Main Street',
        stop_lat: '40.7128',
        stop_lon: '-74.0060',
      },
      {
        id: '2',
        stop_id: 124,
        stop_name: 'Broadway',
        stop_lat: '40.7138',
        stop_lon: '-74.0070',
      },
    ];

    // Mock the API response for the stops query
    mock.onPost('http://db.scholomance.io:2501/api/stops/query').reply(200, mockStops);

    // Render the App component
    const { getByTestId, findByText } = render(<App />);

    // Wait for the loading spinner to appear while fetching stops
    const activityIndicator = getByTestId('loading-indicator');
    expect(activityIndicator).toBeTruthy();

    // Simulate region change to trigger fetchStops
    const region = {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    // Trigger the API call using debouncedFetchStops
    await act(async () => {
      await mock.onPost('http://db.scholomance.io:2501/api/stops/query').reply(200, mockStops);
    });

    // Check if the stops are displayed after the loading spinner is gone
    await findByText('Main Street');
    await findByText('Broadway');

    // Verify the loading indicator is no longer visible
    expect(activityIndicator).toBeFalsy();
  });
});
