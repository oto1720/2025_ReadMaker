import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DisplayModeToggleProps {
  currentMode: 'normal' | 'word';
  onModeChange: (mode: 'normal' | 'word') => void;
  disabled?: boolean;
}

const DisplayModeToggle: React.FC<DisplayModeToggleProps> = ({
  currentMode,
  onModeChange,
  disabled = false
}) => {
  return (
    <View style={styles.displayModeContainer}>
      <Text style={styles.modeLabel}>表示モード</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'normal' && styles.modeButtonActive,
            disabled && styles.modeButtonDisabled
          ]}
          onPress={() => onModeChange('normal')}
          disabled={disabled}
        >
          <Text style={styles.modeIcon}>📄</Text>
          <Text style={[
            styles.modeText,
            currentMode === 'normal' && styles.modeTextActive,
            disabled && styles.modeTextDisabled
          ]}>
            通常表示
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === 'word' && styles.modeButtonActive,
            disabled && styles.modeButtonDisabled
          ]}
          onPress={() => onModeChange('word')}
          disabled={disabled}
        >
          <Text style={styles.modeIcon}>🔤</Text>
          <Text style={[
            styles.modeText,
            currentMode === 'word' && styles.modeTextActive,
            disabled && styles.modeTextDisabled
          ]}>
            単語分割
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  displayModeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'transparent',
    minWidth: 120,
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  modeButtonActive: {
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modeButtonDisabled: {
    opacity: 0.5,
  },
  modeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  modeTextDisabled: {
    color: '#cccccc',
  },
});

export default DisplayModeToggle;