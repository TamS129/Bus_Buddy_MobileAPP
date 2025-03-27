import { useAppTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UserProfile from './UserProfile';

interface MenuItem {
  label: string;
  onPress: () => void;
  requiresAuth?: boolean;
}
interface MenuProps {
  items?: MenuItem[];
}
const fontOptions = ['Default', 'Monospace', 'Serif', 'Cursive'];
const fontColors = ['default', 'gold', 'skyblue', 'lime', 'pink'];
const getSystemFontFamily = (font: string) => {
  switch (font) {
    case 'Monospace':
      return 'monospace';
    case 'Serif':
      return 'serif';
    case 'Cursive':
      return 'cursive';
    default:
      return undefined;
  }
};
const Menu: React.FC<MenuProps> = ({ items = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const {
    theme,
    setTheme,
    font,
    setFont,
    fontColor,
    setFontColor,
  } = useAppTheme();
  const handleUserLogin = () => setIsLoggedIn(true);
  const handleUserLogout = () => setIsLoggedIn(false);
  const getFontStyle = (overrideFont?: string) => ({
    color:
      fontColor === 'default'
        ? theme === 'dark'
          ? 'white'
          : 'black'
        : fontColor,
    fontFamily: getSystemFontFamily(overrideFont ?? font),
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuOpen(!isMenuOpen)}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>
      {isMenuOpen && (
        <View style={styles.menuDropdown}>
          <View style={styles.menuSection}>
            <UserProfile onUserLogin={handleUserLogin} onUserLogout={handleUserLogout} />
          </View>
          {Array.isArray(items) && items.map((item, index) => (
            (!item.requiresAuth || isLoggedIn) && (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  setIsMenuOpen(false);
                }}
              >
                <Text style={[styles.menuItemText, getFontStyle()]}>{item.label}</Text>
              </TouchableOpacity>
            )
          ))}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setIsSettingsVisible(true);
              setIsMenuOpen(false);
            }}
          >
            <Text style={[styles.menuItemText, getFontStyle()]}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <ScrollView
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme === 'dark' ? '#000' : '#fff' },
          ]}
        >
          <Text style={[styles.title, getFontStyle()]}>Settings</Text>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Text style={[styles.settingText, getFontStyle()]}>
              Toggle Dark Mode (Current: {theme})
            </Text>
          </TouchableOpacity>
          <Text style={[styles.subtitle, getFontStyle()]}>Choose Font Style:</Text>
          <View style={styles.optionsRow}>
            {fontOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFont(option)}
                style={[
                  styles.optionButton,
                  font === option && styles.selectedOption,
                ]}
              >
                <Text style={getFontStyle(option)}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.subtitle, getFontStyle()]}>Choose Font Color:</Text>
          <View style={styles.optionsRow}>
            {fontColors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setFontColor(color)}
                style={[
                  styles.colorOption,
                  color === 'default'
                    ? styles.defaultColorOption
                    : { backgroundColor: color },
                  fontColor === color && styles.selectedColor,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsSettingsVisible(false)}>
            <Text style={[styles.closeText, getFontStyle()]}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
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
    backgroundColor: '#2DAEC5',
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
  modalContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  settingButton: {
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  settingText: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#BDE0FE',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  defaultColorOption: {
    backgroundColor: '#000',
    borderTopWidth: 15,
    borderTopColor: '#fff',
    borderBottomWidth: 15,
    borderBottomColor: '#000',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#000',
  },
  closeButton: {
    marginTop: 30,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#2DAEC5',
    borderRadius: 6,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default Menu;