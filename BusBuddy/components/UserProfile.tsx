import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

interface UserProfileProps {
  onUserLogin?: (userId: string) => void;
  onUserLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  onUserLogin, 
  onUserLogout 
}) => {
  const [userId, setUserId] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    if (userId.trim() === '') {
      setError("UserID cannot be empty!!!");
      return;
    }

    try {
      // Check if this guy is already inside the fav table
      const resp = await axios.post('http://db.scholomance.io:2501/api/favorites/query', {
        query: `SELECT * FROM favorites WHERE userID = ${userId}`
      });
      
    } catch { //If user does not exist it automatically creates a new user. 
        axios.post('http://db.scholomance.io:2501/api/favorites', {
          "userID": `${userId}`,
          "stop_id": 111111
        });  
      }
    finally {
      setIsLoggedIn(true);
      setIsModalVisible(false);
      setError('');
      onUserLogin && onUserLogin(userId);
      
    }
      
  };

  const handleLogout = () => {
    setUserId('');
    setIsLoggedIn(false);    
    onUserLogout && onUserLogout();
  };

  return (
    <View style={styles.modalContainer}>
      {!isLoggedIn ? (
        <TouchableOpacity 
          onPress={() => setIsModalVisible(true)}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userIdText}>User: {userId}</Text>
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter User ID</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="Enter your User ID"
              placeholderTextColor="#888"
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                onPress={handleLogin} 
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsModalVisible(false)} 
                style={styles.modalButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#2DAEC5',
    padding: 10,
    borderRadius: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIdText: {
    marginRight: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#2DAEC5',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#2DAEC5',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default UserProfile;