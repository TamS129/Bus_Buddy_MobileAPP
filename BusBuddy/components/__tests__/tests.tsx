import axios from 'axios';
import fetchStops  from '../../app/(tabs)/index';

jest.mock('axios'); 


//Tamara Slone fetchStops function Jest Test
describe('fetchStops', () => {
    it('should fetch stops and update state when given a region', async () => {
        const mockRegion = { latitude: 40.7128, longitude: -74.006, latitudeDelta: 0.1, longitudeDelta: 0.1 };
        const mockData = [{ stop_id: 1, stop_name: 'Test Stop', stop_lat: 40.7128, stop_lon: -74.006 }];

        (axios.post as jest.Mock).mockResolvedValue({ data: mockData });

        const setStops = jest.fn();
        const setLoading = jest.fn();

        await fetchStops.call(mockRegion);

        expect(setLoading).toHaveBeenCalledWith(true);
        expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
        expect(setStops).toHaveBeenCalledWith(mockData);
        expect(setLoading).toHaveBeenCalledWith(false);
    });
});
