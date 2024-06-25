import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import EmptyState from '../../components/EmptyState';
import SearchInput from '../../components/SearchInput';
import VideoCard from '../../components/VideoCard';

import useAppwrite from '../../lib/useAppwrite';
import { getUserBookmarks, searchPosts } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const Search = () => {
  const { user } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite(() => getUserBookmarks(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-2xl font-psemibold text-white">
              Your Bookmarks
            </Text>

            {/* <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View> */}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No Videos found for this search query!"
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
}

export default Search