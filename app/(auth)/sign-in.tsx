import {View, Text} from 'react-native'
import React from 'react'
import {Link} from "expo-router";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);


const SignIn = () => {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text>SignIn</Text>
            <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4">Create An Account</Link>
            <Link href="/">Go Back</Link>
        </SafeAreaView>
    )
}
export default SignIn
