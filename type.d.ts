import type {ImageSourcePropType} from "react-native";

declare global {
    interface TabBarIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }
}

export {};