import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import fs from 'react-native-fs';

const DICTIONARY_ASSET_NAME = 'ipadic.vibrato';
const destinationPath = `${fs.DocumentDirectoryPath}/${DICTIONARY_ASSET_NAME}`;

interface DictionaryContextType {
  path: string | null;
  isReady: boolean;
  error: Error | null;
}

const DictionaryContext = createContext<DictionaryContextType>({} as DictionaryContextType);

export const useDictionary = () => useContext(DictionaryContext);

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupDictionary = async () => {
      try {
        const exists = await fs.exists(destinationPath);
        if (!exists) {
          console.log('Dictionary not found, copying from assets...');
          if (Platform.OS === 'android') {
            await fs.copyFileAssets(DICTIONARY_ASSET_NAME, destinationPath);
          } else if (Platform.OS === 'ios') {
            // For iOS, the file is in the main bundle.
            const sourcePath = `${fs.MainBundlePath}/${DICTIONARY_ASSET_NAME}`;
            await fs.copyFile(sourcePath, destinationPath);
          }
          console.log('Dictionary copied successfully!');
        }
        setPath(destinationPath);
        setIsReady(true);
      } catch (e: any) {
        console.error('Failed to setup dictionary:', e);
        setError(e);
      }
    };

    setupDictionary();
  }, []);

  return (
    <DictionaryContext.Provider value={{ path, isReady, error }}>
      {children}
    </DictionaryContext.Provider>
  );
};
