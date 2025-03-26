import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UserProfile from '../../components/UserProfile';
// import Settings component into here as well

interface MenuItem {
  label: string;
  onPress: () => void;
  requiresAuth?: boolean;
}

interface MenuProps {
  items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUserLogin = (userId: string) => {
    setIsLoggedIn(true);
  };

  const handleUserLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {/* Menu Trigger Button */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>

      {isMenuOpen && (
        <View style={styles.menuDropdown}>
          <View style={styles.menuSection}>
            <UserProfile 
              onUserLogin={handleUserLogin}
              onUserLogout={handleUserLogout}
            />
          </View>
          {items.map((item, index) => (
            (!item.requiresAuth || isLoggedIn) && (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  setIsMenuOpen(false);
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  menuButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
  },
  menuDropdown: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
  },
  menuSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    color: '#333',
  },
});

export default Menu;