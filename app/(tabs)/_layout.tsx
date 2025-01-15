import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { ThemeProvider, useTheme } from '@/src/context/ThemeContext';

// TabBarIcon Component
function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={24} name={name} color={color} />;
}

// ThemeToggleButton Component
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme(); // Use the custom theme hook
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
      <Image
        source={
          isDark
            ? require('../../src/assests/Suntoggle.png') // Light theme toggle icon
            : require('../../src/assests/blacktoggle.png') // Dark theme toggle icon
        }
        style={styles.toggleIcon}
      />
    </TouchableOpacity>
  );
}

// Layout with Theme Toggle
function TabLayoutContent() {
  const { theme } = useTheme(); // Use the custom theme hook
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.background.dark : COLORS.background.light,
        },
        headerStyle: {
          backgroundColor: isDark ? COLORS.background.dark : COLORS.background.light,
        },
        headerTintColor: isDark ? COLORS.text.dark : COLORS.text.light,
        headerRight: () => <ThemeToggleButton />, // Replace Button with ThemeToggleButton
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "WHAT'S NEW",
          tabBarIcon: ({ color }) => <TabBarIcon name="anchor" color={color} />,
        }}
      />

    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabLayoutContent />
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  toggleButton: {
    marginRight: 16,
  },
  toggleIcon: {
    width: 24,
    height: 24,
  },
});
