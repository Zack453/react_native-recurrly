import {View, Text, TextInput, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import {useState} from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import {HOME_SUBSCRIPTIONS} from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((subscription) =>
        subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-background " edges={["top"]}>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >

                <FlatList
                    data={filteredSubscriptions}
                    ListHeaderComponent={
                    <View className="px-5 pt-5">
                        <Text className="text-3xl font-bold text-dark mb-5">
                            Subscriptions
                        </Text>
                        <TextInput
                            className="bg-card rounded-xl px-4 py-3 text-dark mb-4"
                            placeholder="Search subscriptions..."
                            placeholderTextColor= "#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    }
                    renderItem={({item}) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedId === item.id}
                            onPress={() => setExpandedId(expandedId == item.id ? null : item.id)}
                        />
                    )}
                    contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 20, gap: 20 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}
export default Subscriptions
