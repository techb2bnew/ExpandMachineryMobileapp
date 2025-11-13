import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { whiteColor, lightPinkAccent, grayColor, supportGreen, supportGold, supportBlue, redColor, lightColor, lightBlack } from '../constans/Color'
import { style, spacings } from '../constans/Fonts'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { BaseStyle } from '../constans/Style'
import { SafeAreaView } from 'react-native-safe-area-context'
import moment from 'moment'
import api from '../api/apiClient'
import { useDispatch } from 'react-redux'
import { updateNotificationsUnreadCount } from '../store/slices/unreadCountSlice'
import { useFocusEffect } from '@react-navigation/native'
const { alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween, alignItemsFlexStart } = BaseStyle;

const LIMIT = 20

const getNotificationVisuals = (category = '', type = '') => {
  const normalizedCategory = category?.toLowerCase?.() || ''
  const normalizedType = type?.toLowerCase?.() || ''

  switch (normalizedCategory) {
    case 'auth':
      return { icon: 'log-in-outline', iconColor: supportBlue }
    case 'customer':
      return { icon: 'people-outline', iconColor: supportGold }
    case 'ticket':
      return { icon: 'document-text-outline', iconColor: supportGreen }
    default:
      if (normalizedType === 'warning' || normalizedType === 'error') {
        return { icon: 'warning-outline', iconColor: redColor }
      }
      return { icon: 'notifications-outline', iconColor: supportBlue }
  }
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [meta, setMeta] = useState({
    total: 0,
    totalPages: 0,
    unreadCount: 0,
  })
  const [markingIds, setMarkingIds] = useState(() => new Set())
  const [deletingIds, setDeletingIds] = useState(() => new Set())
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const loadingFlagsRef = useRef({
    initial: false,
    refresh: false,
    loadMore: false,
  })
  const dispatch = useDispatch()

  const unreadCount = useMemo(
    () => meta.unreadCount ?? notifications.filter(notification => notification.isUnread).length,
    [meta.unreadCount, notifications]
  )

  React.useEffect(() => {
    dispatch(updateNotificationsUnreadCount(unreadCount))
  }, [dispatch, unreadCount])

  const hydrateNotifications = useCallback((incomingNotifications = []) => {
    return incomingNotifications.map(notification => {
      const { icon, iconColor } = getNotificationVisuals(notification.category, notification.type)

      return {
        id: notification._id,
        title: notification.title,
        description: notification.message,
        timestamp: notification?.createdAt ? moment(notification.createdAt).fromNow() : '',
        isUnread: !notification.isRead,
        icon,
        iconColor,
        raw: notification,
      }
    })
  }, [])

  const fetchNotifications = useCallback(
    async ({ pageToLoad = 1, mode = 'initial' } = {}) => {
      const loadingFlags = loadingFlagsRef.current

      if (mode === 'refresh') {
        if (loadingFlags.refresh) return
        loadingFlags.refresh = true
        setIsRefreshing(true)
      } else if (mode === 'loadMore') {
        if (loadingFlags.loadMore || loadingFlags.initial) return
        loadingFlags.loadMore = true
        setIsLoadingMore(true)
      } else {
        if (loadingFlags.initial) return
        loadingFlags.initial = true
        setIsInitialLoading(true)
      }

      try {
        const response = await api.get('/api/app/notifications', {
          params: {
            page: pageToLoad,
            limit: LIMIT,
          },
        })

        const {
          notifications: apiNotifications = [],
          total = 0,
          totalPages = 0,
          unreadCount: apiUnreadCount,
        } = response.data || {}

        const hydrated = hydrateNotifications(apiNotifications)

        setNotifications(prev => {
          if (mode === 'loadMore') {
            const existingIds = new Set(prev.map(item => item.id))
            const merged = [...prev]

            hydrated.forEach(item => {
              if (!existingIds.has(item.id)) {
                merged.push(item)
              }
            })

            return merged
          }

          return hydrated
        })

        setMeta({
          total,
          totalPages,
          unreadCount:
            typeof apiUnreadCount === 'number'
              ? apiUnreadCount
              : hydrated.filter(item => item.isUnread).length,
        })

        setPage(pageToLoad)
        setHasMorePages(pageToLoad < totalPages)
      } catch (error) {
        const message = error?.message || 'Unable to load notifications right now.'
        Alert.alert('Notifications', message)
      } finally {
        if (mode === 'refresh') {
          loadingFlagsRef.current.refresh = false
          setIsRefreshing(false)
        } else if (mode === 'loadMore') {
          loadingFlagsRef.current.loadMore = false
          setIsLoadingMore(false)
        } else {
          loadingFlagsRef.current.initial = false
          setIsInitialLoading(false)
        }
      }
    },
    [hydrateNotifications]
  )

  useFocusEffect(
    useCallback(() => {
      setHasMorePages(true)
      fetchNotifications({ pageToLoad: 1, mode: 'initial' })
    }, [fetchNotifications])
  )

  const handleRefresh = useCallback(() => {
    if (loadingFlagsRef.current.refresh) return
    setHasMorePages(true)
    fetchNotifications({ pageToLoad: 1, mode: 'refresh' })
  }, [fetchNotifications])

  const handleLoadMore = useCallback(() => {
    if (!hasMorePages || loadingFlagsRef.current.loadMore || loadingFlagsRef.current.initial) return
    fetchNotifications({ pageToLoad: page + 1, mode: 'loadMore' })
  }, [fetchNotifications, hasMorePages, page])

  const markAllAsRead = async () => {
    if (isMarkingAll) return

    setIsMarkingAll(true)

    try {
      await api.put('/api/app/notifications/read-all')

      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          isUnread: false
        }))
      )
      setMeta(prev => ({
        ...prev,
        unreadCount: 0,
      }))
    } catch (error) {
      const message = error?.message || 'Unable to mark all notifications as read.'
      Alert.alert('Notifications', message)
    } finally {
      setIsMarkingAll(false)
    }
  }

  const markAsRead = async (id) => {
    if (markingIds.has(id)) return

    setMarkingIds(prev => {
      const updated = new Set(prev)
      updated.add(id)
      return updated
    })

    try {
      await api.put(`/api/app/notifications/${id}/read`)

      setNotifications(prevNotifications =>
        prevNotifications.map(notification => {
          if (notification.id === id) {
            if (notification.isUnread) {
              setMeta(prev => ({
                ...prev,
                unreadCount: Math.max((prev?.unreadCount || 0) - 1, 0),
              }))
            }

            return { ...notification, isUnread: false }
          }

          return notification
        })
      )
    } catch (error) {
      const message = error?.message || 'Unable to mark notification as read.'
      Alert.alert('Notifications', message)
    } finally {
      setMarkingIds(prev => {
        const updated = new Set(prev)
        updated.delete(id)
        return updated
      })
    }
  }

  const handleDelete = async (id) => {
    if (deletingIds.has(id)) return

    setDeletingIds(prev => {
      const updated = new Set(prev)
      updated.add(id)
      return updated
    })

    try {
      await api.delete(`/api/app/notifications/${id}`)

      setNotifications(prevNotifications => {
        const notificationToDelete = prevNotifications.find(item => item.id === id)

        if (notificationToDelete?.isUnread) {
          setMeta(prev => ({
            ...prev,
            unreadCount: Math.max((prev?.unreadCount || 0) - 1, 0),
          }))
        }

        return prevNotifications.filter(notification => notification.id !== id)
      })
    } catch (error) {
      const message = error?.message || 'Unable to delete notification.'
      Alert.alert('Notifications', message)
    } finally {
      setDeletingIds(prev => {
        const updated = new Set(prev)
        updated.delete(id)
        return updated
      })
    }
  }

  const deleteNotification = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(id)
        }
      ]
    )
  }

  const renderNotificationItem = ({ item }) => {
    const isMarking = markingIds.has(item.id)
    const isDeleting = deletingIds.has(item.id)

    return (
      <TouchableOpacity style={styles.notificationCard} activeOpacity={0.8}>
        <View
          style={[
            flexDirectionRow,
            alignItemsFlexStart,
            { padding: spacings.large },
            item.isUnread && { borderLeftWidth: 4, borderLeftColor: lightPinkAccent, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }, // gold strip for unread
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.iconColor + 20 },
              alignJustifyCenter,
            ]}
          >
            <Icon name={item.icon} size={20} color={whiteColor} />
          </View>

          <View style={styles.notificationTextContainer}>
            <View style={[styles.titleContainer, flexDirectionRow, alignItemsCenter]}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              {item.isUnread && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationDescription}>{item.description}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <View style={[styles.actionButtons, flexDirectionRow, alignItemsCenter]}>
            {item.isUnread && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => markAsRead(item.id)}
                disabled={isMarking}
                activeOpacity={isMarking ? 1 : 0.7}
              >
                {isMarking ? (
                  <ActivityIndicator size="small" color={whiteColor} />
                ) : (
                  <Icon name="checkmark" size={20} color={whiteColor} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteNotification(item.id)}
              disabled={isDeleting}
              activeOpacity={isDeleting ? 1 : 0.7}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={lightPinkAccent} />
              ) : (
                <Icon name="trash-outline" size={20} color={lightPinkAccent} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, { padding: spacings.xLarge }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerTop, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={[flexDirectionRow, alignItemsCenter]}>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
              {/* <TouchableOpacity style={styles.settingsButton}>
                <Icon name="settings-outline" size={24} color={whiteColor} />
              </TouchableOpacity> */}
            </View>
          </View>
          <Text style={styles.unreadText}>{unreadCount} unread notifications</Text>
          <TouchableOpacity
            style={[styles.markAllButton, isMarkingAll && styles.markAllButtonDisabled]}
            onPress={markAllAsRead}
            disabled={isMarkingAll}
            activeOpacity={isMarkingAll ? 1 : 0.7}
          >
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={whiteColor} />
            ) : (
              <Icon name="checkmark" size={20} color={whiteColor} />
            )}
            <Text style={[styles.markAllText, isMarkingAll && styles.markAllTextDisabled]}>
              {isMarkingAll ? 'Marking…' : 'Mark All as Read'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        {isInitialLoading ? (
          <View style={[styles.loaderContainer, alignJustifyCenter]}>
            <ActivityIndicator size="large" color={lightPinkAccent} />
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={whiteColor}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="notifications-off-outline" size={48} color={grayColor} />
                <Text style={styles.emptyStateTitle}>No notifications yet</Text>
                <Text style={styles.emptyStateSubtitle}>You’re all caught up for now.</Text>
              </View>
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.listFooter}>
                  <ActivityIndicator size="small" color={lightPinkAccent} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: hp(90),
    backgroundColor: lightColor,

  },
  header: {
    paddingBottom: spacings.large,
  },
  headerTop: {
    marginBottom: spacings.small,
  },
  headerTitle: {
    ...style.fontSizeLargeX,
    ...style.fontWeightThin1x,
    color: whiteColor,
  },
  unreadBadge: {
    backgroundColor: lightPinkAccent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.medium,
  },
  unreadBadgeText: {
    color: whiteColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: spacings.small,
  },
  unreadText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: grayColor,
    marginBottom: spacings.medium,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButtonDisabled: {
    opacity: 0.6,
  },
  markAllText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  markAllTextDisabled: {
    color: whiteColor,
  },
  notificationsList: {
    paddingBottom: spacings.xxLarge,
  },
  loaderContainer: {
    flex: 1,
    minHeight: hp(50),
  },
  listFooter: {
    paddingVertical: spacings.large,
  },
  notificationCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    marginBottom: spacings.medium,
    // padding: spacings.large,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: 10,
    marginRight: spacings.large,
  },
  notificationTextContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: spacings.xsmall,
  },
  notificationTitle: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginRight: spacings.small,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightPinkAccent,
  },
  notificationDescription: {
    ...style.fontSizeSmall2x,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: spacings.xsmall,
  },
  timestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: grayColor,
  },
  actionButtons: {
    marginLeft: spacings.medium,
  },
  actionButton: {
    padding: spacings.small,
    marginLeft: spacings.small,
  },
  emptyState: {
    paddingVertical: spacings.xxLarge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginTop: spacings.medium,
  },
  emptyStateSubtitle: {
    ...style.fontSizeSmall2x,
    ...style.fontWeightThin,
    color: grayColor,
    marginTop: spacings.small,
  },
})
