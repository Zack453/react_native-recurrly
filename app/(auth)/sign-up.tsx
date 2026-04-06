import {View, Text} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text>SignUp</Text>
            <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Sign In</Link>
        </SafeAreaView>
    )
}

export default SignUp