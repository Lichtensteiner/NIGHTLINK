# NIGHTLINK Mobile App (Expo)

This directory contains the source code for the mobile version of NIGHTLINK, built with React Native and Expo.

## Setup Instructions

To run this mobile app locally on your machine:

1.  **Install Node.js** (if not already installed).
2.  **Install Expo CLI**:
    ```bash
    npm install -g expo-cli
    ```
3.  **Initialize a new Expo project**:
    ```bash
    npx create-expo-app nightlink-mobile --template blank-typescript
    cd nightlink-mobile
    ```
4.  **Install dependencies**:
    ```bash
    npx expo install react-native-safe-area-context react-native-screens @react-navigation/native @react-navigation/stack @react-native-async-storage/async-storage lucide-react-native
    ```
5.  **Copy the files**:
    -   Copy `App.tsx` from this folder to your `nightlink-mobile` folder (replace existing).
    -   Copy the `screens` folder to your `nightlink-mobile` folder.
    -   Copy the `components` folder to your `nightlink-mobile` folder.

6.  **Run the app**:
    ```bash
    npx expo start
    ```
    -   Scan the QR code with the Expo Go app on your phone (Android/iOS).
    -   Or press `a` for Android emulator, `i` for iOS simulator.

## Note

This code is a starting point and shares the same logic as the web version but uses React Native components (`View`, `Text`, `TouchableOpacity`) instead of HTML elements (`div`, `span`, `button`).
