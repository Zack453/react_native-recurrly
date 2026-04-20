import React, {useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {useSignIn} from "@clerk/expo";
import {type Href, Link, useRouter} from "expo-router";
import clsx from "clsx";
import {Ionicons} from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

const PLACEHOLDER_COLOR = "rgba(8,17,38,0.35)";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

type LocalErrors = {
    email?: string;
    password?: string;
    code?: string;
};

export default function SignIn() {
    const {signIn, errors, fetchStatus} = useSignIn();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState("");
    const [localErrors, setLocalErrors] = useState<LocalErrors>({});

    const isLoading = fetchStatus === "fetching";

    function clearFieldError(field: keyof LocalErrors) {
        setLocalErrors((prev) => ({...prev, [field]: undefined}));
    }

    function validateCredentials() {
        const errs: LocalErrors = {};
        if (!isValidEmail(email)) errs.email = "Enter a valid email address.";
        if (password.length < 8) errs.password = "Password must be at least 8 characters.";
        setLocalErrors(errs);
        return Object.keys(errs).length === 0;
    }

    const navigate = ({session, decorateUrl}: {session: any; decorateUrl: (url: string) => string}) => {
        if (session?.currentTask) return;
        const url = decorateUrl("/");
        if (url.startsWith("http")) return;
        router.replace(url as Href);
    };

    async function handleSignIn() {
        if (!validateCredentials()) return;
        const {error} = await signIn.password({emailAddress: email.trim(), password});
        if (error) return;

        if (signIn.status === "complete") {
            await signIn.finalize({navigate});
        } else if (signIn.status === "needs_client_trust") {
            await signIn.mfa.sendEmailCode();
        }
    }

    async function handleVerify() {
        if (!code.trim()) {
            setLocalErrors({code: "Enter the 6-digit code from your email."});
            return;
        }
        await signIn.mfa.verifyEmailCode({code});
        if (signIn.status === "complete") {
            await signIn.finalize({navigate});
        }
    }

    // ── MFA / email trust verification step ──────────────────────────────────
    if (signIn.status === "needs_client_trust") {
        return (
            <SafeAreaView className="auth-safe-area">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{flex: 1}}
                >
                    <ScrollView
                        style={{flex: 1}}
                        contentContainerStyle={{flexGrow: 1}}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="auth-content">
                            {/* Brand */}
                            <View className="auth-brand-block">
                                <View className="auth-logo-wrap">
                                    <View className="auth-logo-mark">
                                        <Text className="auth-logo-mark-text">R</Text>
                                    </View>
                                    <View>
                                        <Text className="auth-wordmark">Recurrly</Text>
                                        <Text className="auth-wordmark-sub">Subscription Tracker</Text>
                                    </View>
                                </View>
                                <Text className="auth-title">Check your email</Text>
                                <Text className="auth-subtitle">
                                    We sent a 6-digit code to{"\n"}
                                    {email}
                                </Text>
                            </View>

                            {/* Card */}
                            <View className="auth-card">
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification code</Text>
                                        <TextInput
                                            className={clsx(
                                                "auth-input",
                                                (localErrors.code ?? errors?.fields?.code) && "auth-input-error"
                                            )}
                                            value={code}
                                            onChangeText={(v) => {
                                                setCode(v);
                                                clearFieldError("code");
                                            }}
                                            placeholder="000000"
                                            placeholderTextColor={PLACEHOLDER_COLOR}
                                            keyboardType="number-pad"
                                            autoFocus
                                            maxLength={6}
                                        />
                                        {(localErrors.code ?? errors?.fields?.code?.message) ? (
                                            <Text className="auth-error">
                                                {localErrors.code ?? errors?.fields?.code?.message}
                                            </Text>
                                        ) : null}
                                    </View>

                                    <Pressable
                                        className={clsx("auth-button", isLoading && "auth-button-disabled")}
                                        onPress={handleVerify}
                                        disabled={isLoading}
                                    >
                                        <Text className="auth-button-text">
                                            {isLoading ? "Verifying…" : "Verify email"}
                                        </Text>
                                    </Pressable>

                                    <View className="auth-divider-row">
                                        <View className="auth-divider-line"/>
                                        <Text className="auth-divider-text">or</Text>
                                        <View className="auth-divider-line"/>
                                    </View>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signIn.mfa.sendEmailCode()}
                                        disabled={isLoading}
                                    >
                                        <Text className="auth-secondary-button-text">Resend code</Text>
                                    </Pressable>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signIn.reset()}
                                        disabled={isLoading}
                                    >
                                        <Text className="auth-secondary-button-text">
                                            Use a different account
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // ── Main sign-in form ─────────────────────────────────────────────────────
    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{flex: 1}}
            >
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="auth-content">
                        {/* Brand */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">Subscription Tracker</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">
                                Sign in to keep your subscriptions under control
                            </Text>
                        </View>

                        {/* Form card */}
                        <View className="auth-card">
                            <View className="auth-form">
                                {/* Email */}
                                <View className="auth-field">
                                    <Text className="auth-label">Email address</Text>
                                    <TextInput
                                        className={clsx(
                                            "auth-input",
                                            (localErrors.email ?? errors?.fields?.identifier) && "auth-input-error"
                                        )}
                                        value={email}
                                        onChangeText={(v) => {
                                            setEmail(v);
                                            clearFieldError("email");
                                        }}
                                        placeholder="you@example.com"
                                        placeholderTextColor={PLACEHOLDER_COLOR}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="next"
                                    />
                                    {(localErrors.email ?? errors?.fields?.identifier?.message) ? (
                                        <Text className="auth-error">
                                            {localErrors.email ?? errors?.fields?.identifier?.message}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Password */}
                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <View style={{position: "relative"}}>
                                        <TextInput
                                            className={clsx(
                                                "auth-input",
                                                (localErrors.password ?? errors?.fields?.password) && "auth-input-error"
                                            )}
                                            value={password}
                                            onChangeText={(v) => {
                                                setPassword(v);
                                                clearFieldError("password");
                                            }}
                                            placeholder="••••••••"
                                            placeholderTextColor={PLACEHOLDER_COLOR}
                                            secureTextEntry={!showPassword}
                                            returnKeyType="done"
                                            onSubmitEditing={handleSignIn}
                                            style={{paddingRight: 48}}
                                        />
                                        <Pressable
                                            onPress={() => setShowPassword((v) => !v)}
                                            style={{
                                                position: "absolute",
                                                right: 14,
                                                top: 0,
                                                bottom: 0,
                                                justifyContent: "center",
                                            }}
                                            hitSlop={8}
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={20}
                                                color="rgba(8,17,38,0.4)"
                                            />
                                        </Pressable>
                                    </View>
                                    {(localErrors.password ?? errors?.fields?.password?.message) ? (
                                        <Text className="auth-error">
                                            {localErrors.password ?? errors?.fields?.password?.message}
                                        </Text>
                                    ) : null}
                                </View>

                                {/* Submit */}
                                <Pressable
                                    className={clsx(
                                        "auth-button",
                                        (!email || !password || isLoading) && "auth-button-disabled"
                                    )}
                                    onPress={handleSignIn}
                                    disabled={!email || !password || isLoading}
                                >
                                    <Text className="auth-button-text">
                                        {isLoading ? "Signing in…" : "Continue"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign-up link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">New to Recurrly?</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <Pressable>
                                    <Text className="auth-link">Create an account</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
