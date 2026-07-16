import React from "react";
import type { ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface ListProps {
  data: any;
  renderItem: any;
  numColumns?: number;
  keyExtractor?: (item: any) => string;
  isShowVerticalIndicator?: boolean;
  isShowHorizontalIndicator?: boolean;
  children?: any;
  listKey?: string;
  contentContainerStyle?: ViewStyle;
  onEndReached?: any;
  onScroll?: () => void;
  headerComponent?: any;
  footerComponent?: any;
  ref?: any;
  listEmptyComponent?: any;
  onEndReachedThreshold?: any;
  innerRef?: any;
  style?: ViewStyle;
  nestedScrollEnabled?: boolean;
  onRefresh?: any;
  refreshing?: any;
  refreshControl?: any;
  extraData?: any;
}

export const VerticalList = (props: ListProps) => {
  const {
    data,
    renderItem,
    numColumns,
    keyExtractor,
    isShowVerticalIndicator,
    listKey,
    contentContainerStyle,
    onEndReached,
    onScroll,
    headerComponent,
    footerComponent,
    ref,
    listEmptyComponent,
    onEndReachedThreshold,
    nestedScrollEnabled,
    onRefresh,
    refreshing,
    refreshControl,
    extraData,
  } = props;
  return (
    <FlatList
      onScroll={onScroll}
      onRefresh={onRefresh}
      refreshing={refreshing}
      key={listKey}
      ref={ref}
      refreshControl={refreshControl}
      nestedScrollEnabled={nestedScrollEnabled || true}
      initialNumToRender={10}
      showsVerticalScrollIndicator={isShowVerticalIndicator || false}
      horizontal={false}
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      onEndReached={onEndReached}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      ListEmptyComponent={listEmptyComponent}
      onEndReachedThreshold={onEndReachedThreshold}
      extraData={extraData}
    />
  );
};

export const HorizontalList = (props: ListProps) => {
  const {
    data,
    renderItem,
    numColumns,
    keyExtractor,
    isShowHorizontalIndicator,
    listKey,
    contentContainerStyle,
    innerRef,
    style,
    nestedScrollEnabled,
  } = props;
  return (
    <FlatList
      ref={innerRef}
      key={listKey}
      nestedScrollEnabled={nestedScrollEnabled || true}
      showsHorizontalScrollIndicator={isShowHorizontalIndicator || false}
      horizontal={true}
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      style={style}
    />
  );
};

export const VirtualizedView = (props: any) => {
  return (
    <FlatList
      removeClippedSubviews={true}
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => "dummy"}
      renderItem={null}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
    />
  );
};
