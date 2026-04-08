import "@/global.css"
import {FlatList, Image, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind";
import images from "@/constants/images";
import {icons} from "@/constants/icons";
import {HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpComingSubscriptionCard from "@/components/UpComingSubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {

    // Change image to a perosnal avatar

    return (
        <SafeAreaView className="flex-1 bg-background p-5">

            <View className="home-header">
                    <View className="home-user">
                        <Image source={images.catavatar} className="home-avatar"/>
                        <Text className="home-user-name">{HOME_USER.name}</Text>
                    </View>

                <Image source={icons.add} className="home-add-icon"/>
            </View>

            <View className="home-balance-card">
                <Text className="home-balance-label" >Balance</Text>

                <View className="home-balance-row">
                    <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                    <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
                </View>
            </View>

            <View>
                <ListHeading title="Upcoming" />
                <FlatList
                    data={UPCOMING_SUBSCRIPTIONS}
                    renderItem={({item}) => (<UpComingSubscriptionCard {...item}/>)}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No Upcoming Subscriptions</Text>}
                />
            </View>

            <View>
                <ListHeading title="All Subscriptions" />
            </View>

        </SafeAreaView>
    );
}