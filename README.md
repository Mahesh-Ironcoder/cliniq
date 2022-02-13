# CLINIQ
- React Native APP

## Requirements
- npm
- nodejs
- react-native-cli
- android-studio 

**Note: pls look into the [RN docs](https://reactnative.dev/docs/environment-setup) for setting up the environment for react native app and also this [article](https://reactnative.dev/docs/running-on-device) for running into on the device**

## To install
clone the repo into the machine

`cd cliniq`

`npm i`

## Before running the app:
- start this [RTC server](https://github.com/Mahesh-Ironcoder/cliniq-rtc-server)
- `adb reverse tcp:6061 tcp:6061`

## To run
for android(recommended): `npx react-native run-android`

for ios: `npx react-native run-ios`
