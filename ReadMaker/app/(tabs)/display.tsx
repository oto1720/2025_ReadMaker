import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

// 速度調整UIの型定義
interface SpeedControlProps {
  initialSpeed?: number;
  minSpeed?: number;
  maxSpeed?: number;
  onSpeedChange: (speed: number) => void;
}

// 速度調整UI
const SpeedControl: React.FC<SpeedControlProps> = ({
  initialSpeed = 300,
  minSpeed = 100,
  maxSpeed = 800,
  onSpeedChange
}) => {
  //スライダーの値変更時に呼び出される
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);

  const handleSpeedChange = (value: number) => {
    const roundedValue = Math.round(value);
    setCurrentSpeed(roundedValue);
    onSpeedChange(roundedValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>読み取り速度</Text>
      <View style={styles.speedDisplay}>
        <Text style={styles.speedValue}>{currentSpeed} WPM</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.minMaxLabel}>{minSpeed}</Text>
        <Slider
          style={styles.slider}
          minimumValue={minSpeed}
          maximumValue={maxSpeed}
          value={currentSpeed}
          onValueChange={handleSpeedChange}
          minimumTrackTintColor="#FF6B35"
          maximumTrackTintColor="#E0E0E0"
        />
        <Text style={styles.minMaxLabel}>{maxSpeed}</Text>
      </View>

      {/* 速度の意味を示すラベル */}
      <View style={styles.speedLabels}>
        <Text style={styles.speedLabel}>遅い</Text>
        <Text style={styles.speedLabel}>速い</Text>
      </View>
    </View>
  );
};

// スタイル
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },

  speedDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },

  speedValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },

  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },

  minMaxLabel: {
    fontSize: 12,
    color: '#666666',
    width: 40,
    textAlign: 'center',
  },

  speedLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  speedLabel: {
    fontSize: 12,
    color: '#999999',
  },
});

export default SpeedControl;