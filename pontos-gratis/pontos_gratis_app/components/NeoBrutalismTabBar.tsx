import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Design System Colors
const COLORS = {
  ACTIVE: '#f89736', // carrot-orange
  INACTIVE: '#faf8f9', // seasalt
  BORDER: '#080a1b', // rich black
  TEXT_ACTIVE: '#080a1b', // rich black for active text
  TEXT_INACTIVE: '#666666', // light grey for inactive text
};

const NeoBrutalismTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // Ensure the route name matches the defined routes
              const routeName = route.name === 'index' ? '/' : `/${route.name}`;
              router.push(routeName as Href<string | object>);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[styles.tabItem, isFocused ? styles.tabItemFocused : styles.tabItemInactive]}
            >
              {options.tabBarIcon && typeof options.tabBarIcon === 'function' && (
                options.tabBarIcon({ color: isFocused ? COLORS.TEXT_ACTIVE : COLORS.TEXT_INACTIVE, focused: isFocused, size: 24 })
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // Ensure the tab bar is anchored to the bottom
    left: 0,
    right: 0,
    backgroundColor: COLORS.ACTIVE,
    borderTopWidth: 3,
    borderColor: COLORS.BORDER,
    zIndex: 1000,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRightWidth: 0,
    borderColor: COLORS.BORDER,
  },
  tabItemFocused: {
    backgroundColor: COLORS.ACTIVE,
  },
  tabItemInactive: {
    backgroundColor: COLORS.ACTIVE,
  },
});

export default NeoBrutalismTabBar;
