//
//  constants.js
//  altsource-viewer (https://github.com/therealFoxster/altsource-viewer)
//
//  Copyright (c) 2023 Foxster.
//  MIT License.
//

export const urlSearchParams = new URLSearchParams(window.location.search);

export const sourceURL = urlSearchParams.get('source')?.replaceAll("+", "%2B");

// https://stackoverflow.com/a/8943487
export const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|)])/ig;

export const sources = [
    "https://therealfoxster.github.io/altsource/apps.json",
    "https://qnblackcat.github.io/AltStore/apps.json",
    "https://quarksources.github.io/dist/quantumsource.min.json",
    "https://quarksources.github.io/dist/quantumsource%2B%2B.min.json",
    "https://alt.getutm.app",
    "https://flyinghead.github.io/flycast-builds/altstore.json",
    "https://provenance-emu.com/apps.json"
];

export const entitlements = {
    "com.apple.security.application-groups": {
        "name": "App Groups",
        "description": "Allow app to share files with other apps and app extensions in the same App Group.",
        "icon": "columns-gap"
    },
    "com.apple.developer.associated-domains": {
        "name": "Associated Domains",
        "description": "The associated domains for specific services, such as shared web credentials, universal links, and App Clips.",
        "icon": "globe2"
    },
    "com.apple.developer.carplay-audio": {
        "name": "CarPlay Audio",
        "description": "Allows the app the provide audio content for CarPlay.",
        "icon": "car-front-fill"
    },
    "get-task-allow": {
        "name": "Debuggable",
        "description": "Allow developers to attach a debugger to this app. This permission is required for JIT to work.",
        "icon": "tools"
    },
    "com.apple.developer.device-information.user-assigned-device-name": {
        "name": "Device Name",
        "description": "Grants access to the user-assigned device name instead of a generic device name.",
        "icon": "phone-fill"
    },
    "keychain-access-groups": {
        "name": "Keychain",
        "description": "Allows app to read and write secure data to the system's keychain.",
        "icon": "key-fill"
    },
    "com.apple.developer.networking.multicast": {
        "name": "Multicast",
        "description": "App can send or receive IP multicast traffic.",
        "icon": "globe2"
    },
    "aps-environment": {
        "name": "Push Notifications",
        "description": "App can send push notifications.",
        "icon": "app-indicator"
    },
    "com.apple.developer.applesignin": {
        "name": "Sign in with Apple",
        "description": "Allows sign in with Apple.",
        "icon": "apple"
    },
    "com.apple.developer.siri": {
        "name": "Siri",
        "description": "Allows app to handle Siri requests.",
        "icon": "mic-fill"
    },
    "com.apple.developer.networking.wifi-info": {
        "name": "Wi-Fi Information Access",
        "description": "Allows app to access information about the connected Wi-Fi network.",
        "icon": "wifi"
    }
};

export const privacy = {
    "NSAppleMusicUsageDescription": {
        "icon": "music-note-beamed"
    },
    "NSBluetoothAlwaysUsageDescription": {
        "name": "Bluetooth",
        "icon": "bluetooth"
    },
    "NSBluetoothPeripheralUsageDescription": {
        "name": "Bluetooth (Peripherals)",
        "icon": "bluetooth"
    },
    "NSContactsUsageDescription": {
        "icon": "person-circle"
    },
    "NSCameraUsageDescription": {
        "icon": "camera-fill"
    },
    "NSFaceIDUsageDescription": {
        "name": "Face ID",
        "icon": "person-bounding-box"
    },
    "NSLocalNetworkUsageDescription": {
        "icon": "globe2"
    },
    "NSLocationWhenInUseUsageDescription": {
        "name": "Location (When Using)",
        "icon": "cursor-fill"
    },
    "NSMicrophoneUsageDescription": {
        "icon": "mic-fill"
    },
    "NSPhotoLibraryUsageDescription": {
        "name": "Photos",
        "icon": "images"
    },
    "NSPhotoLibraryAddUsageDescription": {
        "name": "Photos (Add)",
        "icon": "image"
    },
    "NSUserTracking": {
        "icon": "person-vcard-fill"
    }
};

export const legacyPermissions = {
    "background-audio": {
        "icon": "volume-up-fill"
    },
    "background-fetch": {
        "icon": "arrow-repeat"
    },
    "photos": {
        "icon": "images"
    }
};