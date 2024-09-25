import React from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

// Button Component
interface NeoButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ title, onPress, className }) => (
  <StyledTouchableOpacity
    className={`bg-orange-400 py-4 px-6 rounded-xl border-2 border-gray-800 shadow-lg ${className}`}
    onPress={onPress}
  >
    <StyledText className="text-gray-800 text-lg font-semibold text-center">{title}</StyledText>
  </StyledTouchableOpacity>
);

// Input Component
interface NeoInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  className?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ placeholder, onChangeText, value, className }) => (
  <StyledTextInput
    className={`bg-orange-100 border-2 border-gray-800 rounded-xl py-4 px-5 text-base shadow-lg ${className}`}
    placeholder={placeholder}
    onChangeText={onChangeText}
    value={value}
    placeholderTextColor="gray"
  />
);

// Card Component
interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
}

export const NeoCard: React.FC<NeoCardProps> = ({ children, className }) => (
  <StyledView
    className={`bg-orange-100 rounded-xl border-2 border-gray-800 p-5 shadow-lg ${className}`}
  >
    {children}
  </StyledView>
);

// Header Component
interface NeoHeaderProps {
  title: string;
  className?: string;
  textClassName?: string;
}

export const NeoHeader: React.FC<NeoHeaderProps> = ({ title, className, textClassName }) => (
  <StyledView className={`bg-orange-400 py-5 px-4 border-b-2 border-gray-800 ${className}`}>
    <StyledText className={`text-gray-800 text-2xl font-bold ${textClassName}`}>{title}</StyledText>
  </StyledView>
);
