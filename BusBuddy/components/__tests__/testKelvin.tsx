import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import UserProfile from '../../components/UserProfile';
import axios from 'axios';
//import MockAdapter from 'axios-mock-adapter';

jest.mock('axios');
// const mockedAxios = newMockAdapter(axios)
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfileTest', () => {
    // mock functions
    const mockLogin = jest.fn();
    const mockLogout = jest.fn();

    // before each test
    beforeEach(() => {
        // clear all mock func calls
        jest.clearAllMocks();
        // reset mockedAxios post method
        mockedAxios.post.mockReset();
    });

    // HOW TO : Abstract render call so it's not repeated in every check

    it('Gets the login button when a user is NOT logged in', () => {
        const {getByText} = render(<UserProfile></UserProfile>);

        expect(getByText('Login')).toBeTruthy();
    });

    it('The modal renders when the login button is tapped', () => {
        const {getByText} = render(<UserProfile></UserProfile>);

        fireEvent.press(getByText('Login'));

        expect(getByText('Enter User ID')).toBeTruthy();
    });

    it('Does NOT accept an empty userId', () => {
        const {getByText, getAllByText} = render(<UserProfile></UserProfile>);

        fireEvent.press(getByText('Login'));
        // Now there are 2 Login buttons on the screen b/c modal
        const loginButtons = getAllByText('Login');
        // press the modal login button
        fireEvent.press(loginButtons[1]);

        expect(getByText('UserID cannot be empty!!!')).toBeTruthy();
    });

    it('Successfully logs in with an existing user', async () => {
        // simulating user query and returning mock data
        mockedAxios.post.mockResolvedValueOnce({
            data : [{ userID : 'testUser', stop_id : 12345}]
        });

        const {getByText, getAllByText, getByPlaceholderText, findByText} = render(<UserProfile onUserLogin={mockLogin}></UserProfile>);

        fireEvent.press(getByText('Login'));
        // Now there are 2 Login buttons on the screen b/c modal
        const loginButtons = getAllByText('Login');
        const userInput = getByPlaceholderText('Enter your User ID');
        fireEvent.changeText(userInput, 'testUser');
        // press the modal login button
        fireEvent.press(loginButtons[1]);
        // wait for user's ID to appear which means success
        await findByText('User:\ntestUser');

        expect(mockLogin).toHaveBeenCalled();
        expect(mockLogin).toHaveBeenCalledWith('testUser');
    });

    it('Successfully logs OUT', async() => {
        // simulating user query and returning mock data
        mockedAxios.post.mockResolvedValueOnce({
            data : [{ userID : 'testUser', stop_id : 12345}]
        });

        const {getByText, getAllByText, getByPlaceholderText, findByText, queryByText} = render(<UserProfile onUserLogin={mockLogin} onUserLogout={mockLogout}></UserProfile>);

        fireEvent.press(getByText('Login'));
        // Now there are 2 Login buttons on the screen b/c modal
        const loginButtons = getAllByText('Login');
        const userInput = getByPlaceholderText('Enter your User ID');
        fireEvent.changeText(userInput, 'testUser');
        // press the modal login button
        fireEvent.press(loginButtons[1]);
        // wait for user's ID to appear which means success
        await findByText('User:\ntestUser');
        // now log out
        fireEvent.press(getByText('Logout'));

        expect(queryByText('User:\ntestUser')).toBeNull();
        expect(mockLogin).toHaveBeenCalled();
        expect(mockLogout).toHaveBeenCalled();
    });
});