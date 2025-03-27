import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import FavoritesList from '../../app/(tabs)/FavoritesList';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Mock external dependencies
jest.mock('expo-secure-store');
jest.mock('axios');

describe('FavoritesList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders favorites correctly', async () => {
        // Set up SecureStore to return a UUID
        (SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
            if (key === 'secure_deviceid') return Promise.resolve('test-uuid');
            return Promise.resolve(null);
        });
        // Mock axios POST call for fetching favorites
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: [
                { stop_id: 1, stop_name: 'Stop One' },
                { stop_id: 2, stop_name: 'Stop Two' },
            ],
        });

        const { getByText } = render(<FavoritesList />);

        // Wait for the favorites to load and verify the names appear
        await waitFor(() => {
            expect(getByText('Stop One')).toBeTruthy();
            expect(getByText('Stop Two')).toBeTruthy();
            // The "Press home to return" prompt should be there
            expect(getByText('Press home to return')).toBeTruthy();
        });
    });
});
