import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../constans/Color';
import { heightPercentageToDP, widthPercentageToDP } from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constans/Constants';
import moment from 'moment';

const TABS = ['Customer Management', 'Tickets & Communication'];
const PAGE_LIMIT = 50;

const AgentHome = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Customer Management');

  // popups
  const [openActionFor, setOpenActionFor] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [showCat, setShowCat] = useState(false);

  const [status, setStatus] = useState('All Status'); // pending | in_progress | closed | resolved
  const [category, setCategory] = useState('All Categories'); // categoryId.name
  const [catOptions, setCatOptions] = useState(['All Categories']);
  const [search, setSearch] = useState('');

  // COMMON
  const [token, setToken] = useState(null);
  const searchDebounce = useRef(null);

  // CUSTOMERS state
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]); // customers data
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // TICKETS state
  const [tPage, setTPage] = useState(1);
  const [tList, setTList] = useState([]); // API: tickets[]
  const [tHasMore, setTHasMore] = useState(true);
  const [tLoading, setTLoading] = useState(false);
  const [tRefreshing, setTRefreshing] = useState(false);

  // bootstrap token
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem('userToken');
        setToken(t);
      } catch (e) {
        console.log('token read error', e);
      }
    })();
  }, []);

  // customers fetch
  const fetchCustomers = async (reset = false) => {
    if (loading || !token) return;
    setLoading(true);
    try {
      const nextPage = reset ? 1 : page;
      const url =
        `${API_ENDPOINTS.BASE_URL}/api/app/agent/customers` +
        `?page=${nextPage}&limit=${PAGE_LIMIT}&search=${encodeURIComponent(
          search,
        )}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      console.log('datatata', data);

      const items = data?.customers || data?.data || data || [];
      setList(reset ? items : [...list, ...items]);
      setHasMore(items.length >= PAGE_LIMIT);
      setPage(nextPage + 1);
    } catch (e) {
      console.log('customers fetch error:', e.message);
    } finally {
      setLoading(false);
      if (reset) setRefreshing(false);
    }
  };

  // tickets URL builder (matches your swagger + response)
  const buildTicketsUrl = nextPage => {
    const base = `${API_ENDPOINTS.BASE_URL}/api/app/agent/tickets`;
    const qs = new URLSearchParams();
    qs.append('page', String(nextPage));
    qs.append('limit', String(PAGE_LIMIT));

    const s = (status || '').toLowerCase().replace(/\s+/g, '_');
    if (s && s !== 'all_status') qs.append('status', s); // pending|in_progress|closed|resolved

    if (category && category !== 'All Categories')
      qs.append('category', category);

    if (search) qs.append('search', search);

    return `${base}?${qs.toString()}`;
  };

  // tickets fetch (expects { tickets: [...], meta: {total,page,limit,pages} })
  const fetchTickets = async (reset = false) => {
    if (tLoading || !token) return;
    setTLoading(true);
    try {
      const nextPage = reset ? 1 : tPage;
      const url = buildTicketsUrl(nextPage);
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // if (!res.ok) throw new Error('Tickets fetch failed');

      const data = await res.json();
      console.log('datatatticket', data);

      const items = Array.isArray(data?.tickets) ? data.tickets : [];
      const meta = data?.meta || {};

      setTList(reset ? items : [...tList, ...items]);

      if (meta.page != null && meta.pages != null) {
        setTHasMore(meta.page < meta.pages);
        setTPage((meta.page || 1) + 1);
      } else {
        setTHasMore(items.length >= PAGE_LIMIT);
        setTPage(nextPage + 1);
      }

      // merge category names into dropdown options
      const names = items.map(t => t?.categoryId?.name).filter(Boolean);
      const unique = Array.from(
        new Set(['All Categories', ...catOptions, ...names]),
      );
      setCatOptions(unique);
    } catch (e) {
      console.log('tickets fetch error:', e.message);
    } finally {
      setTLoading(false);
      if (reset) setTRefreshing(false);
    }
  };

  // initial load for current tab
  useEffect(() => {
    if (!token) return;
    if (activeTab === 'Tickets & Communication') fetchTickets(true);
    else fetchCustomers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  // debounced search (common)
  useEffect(() => {
    if (!token) return;
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      if (activeTab === 'Tickets & Communication') {
        setTRefreshing(true);
        fetchTickets(true);
      } else {
        setRefreshing(true);
        fetchCustomers(true);
      }
    }, 400);
    return () => clearTimeout(searchDebounce.current);
  }, [search, activeTab, token]);

  // re-load tickets when filters change
  useEffect(() => {
    if (!token || activeTab !== 'Tickets & Communication') return;
    setTRefreshing(true);
    fetchTickets(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, category]);

  // delete (customers only)
  const confirmDelete = async () => {
    if (!deleteId || !token) return;
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/app/agent/customers/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error('Delete failed');
      fetchCustomers(true);
    } catch (e) {
      console.log('delete error:', e.message);
    } finally {
      setDeleteId(null);
    }
  };

  // KPIs (customers)
  const today = moment().format('YYYY-MM-DD');
  const currentMonth = moment().format('MM');
  const currentYear = moment().format('YYYY');
  const onlineCustomers = list.filter(
    item => item.status?.toLowerCase() === 'online',
  ).length;
  const newToday = list.filter(
    item => moment(item.createdAt).format('YYYY-MM-DD') === today,
  ).length;
  const thisMonth = list.filter(item => {
    const date = moment(item.createdAt);
    return (
      date.format('MM') === currentMonth && date.format('YYYY') === currentYear
    );
  }).length;

  // KPIs (tickets) — from current page list
  const totalTickets = tList.length;
  const pendingCount = tList.filter(
    t => (t.status || '').toLowerCase() === 'pending',
  ).length;
  const inProgressCount = tList.filter(
    t => (t.status || '').toLowerCase() === 'in_progress',
  ).length;
  const resolvedCount = tList.filter(
    t => (t.status || '').toLowerCase() === 'resolved',
  ).length;

  const cards =
    activeTab === 'Customer Management'
      ? [
          {
            value: String(list.length),
            label: 'Total Customer',
            color: colors.red,
          },
          {
            value: String(onlineCustomers),
            label: 'Online Customer',
            color: colors.orange,
          },
          { value: String(newToday), label: 'New Today', color: colors.green },
          { value: String(thisMonth), label: 'This Month', color: colors.pink },
        ]
      : [
          {
            value: String(totalTickets),
            label: 'Total Tickets',
            color: colors.red,
          },
          { value: String(pendingCount), label: 'Pending', color: colors.pink },
          {
            value: String(inProgressCount),
            label: 'In Progress',
            color: colors.green,
          },
          {
            value: String(resolvedCount),
            label: 'Resolved',
            color: colors.orange,
          },
        ];

  const columns = useMemo(() => {
    return activeTab === 'Customer Management'
      ? [
          { key: 'name', title: 'Name', flex: 1.1 },
          { key: 'email', title: 'Email', flex: 1.1 },
        ]
      : [
          { key: 'name', title: 'Ticket #', flex: 1.1 }, // ticketNumber
          { key: 'customer', title: 'Customer', flex: 1.1 },
        ];
  }, [activeTab]);

  const data =
    activeTab === 'Customer Management'
      ? list.map(it => ({
          id: it._id,
          name: `${it.name}`.trim(),
          email: it.email || '',
          __raw: it,
        }))
      : tList.map(t => ({
          id: t._id,
          name: t.ticketNumber,
          customer: t?.customer?.name || '',
          __raw: t,
        }));

  const closeAll = () => {
    setOpenActionFor(null);
    setShowStatus(false);
    setShowCat(false);
  };

  const ActionDropdown = ({ itemId, raw }) => {
    if (openActionFor !== raw?._id) return null;
    return (
      <View
        style={{
          position: 'absolute',
          width: widthPercentageToDP(22),
          top: 48,
          right: 5,
          backgroundColor: '#fff',
          borderRadius: 10,
          elevation: 10,
          shadowColor: '#000',
          paddingVertical: 6,
          zIndex: 99999,
        }}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setOpenActionFor(null);
            navigation.navigate('CustomerDetails', { id: raw._id });
          }}
        >
          <Text style={styles.menuText}>View</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setOpenActionFor(null);
            navigation.navigate('CustomerForm', {
              type: 'edit',
              customerData: raw,
            });
          }}
        >
          <Text style={styles.menuText}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setOpenActionFor(null);
            setDeleteId(raw._id);
          }}
        >
          <Text style={[styles.menuText, { color: colors.red }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Dropdown = ({ open, setOpen, value, setValue, items }) => (
    <View style={{ flex: 1, marginRight: 10 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.ddTrigger}
        onPress={() => {
          setShowStatus(false);
          setShowCat(false);
          setOpen(!open);
        }}
      >
        <Text style={styles.ddTriggerText}>{value}</Text>
        <Entypo
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.menu}>
          {items?.map((it, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              onPress={() => {
                setValue(it);
                setOpen(false);
              }}
            >
              <Text style={[styles.menuText, { color: '#000' }]}>{it}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row} key={item?.id}>
      {columns?.map(col => (
        <Text key={col.key} style={[styles.cell, { flex: col.flex }]}>
          {item[col.key]}
        </Text>
      ))}

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() =>
          setOpenActionFor(openActionFor === item.id ? null : item.id)
        }
      >
        <Entypo
          name="dots-three-vertical"
          size={18}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      <ActionDropdown itemId={item.id} raw={item.__raw} />
    </View>
  );

  const renderTicketRow = ({ item }) => (
    <TouchableOpacity
      style={[styles.row, { zIndex: 11 }]}
      onPress={() => navigation.navigate('AgentChatScreen', { customer: item })}
    >
      {columns.map(col => (
        <Text key={col.key} style={[styles.cell, { flex: col.flex }]}>
          {item[col.key]}
        </Text>
      ))}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() =>
          navigation.navigate('AgentChatScreen', { customer: item })
        }
      >
        <Entypo
          name="dots-three-vertical"
          size={18}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {(openActionFor !== null || showStatus || showCat) && (
        <Pressable style={StyleSheet.absoluteFill} onPress={closeAll} />
      )}

      {/* tabs */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabsGroup}>
          {TABS?.map((tab, index) => {
            const active = activeTab === tab;
            const isFirst = index === 0;
            const isLast = index === TABS?.length - 1;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  active ? styles.tabActive : styles.tabInactive,
                  isFirst && styles.firstTab,
                  isLast && styles.lastTab,
                ]}
                onPress={() => {
                  setActiveTab(tab);
                  closeAll();
                }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* KPIs */}
      <View style={styles.cardContainer}>
        {(activeTab === 'Customer Management'
          ? [
              {
                value: String(list.length),
                label: 'Total Customer',
                color: colors.red,
              },
              {
                value: String(onlineCustomers),
                label: 'Online Customer',
                color: colors.orange,
              },
              {
                value: String(newToday),
                label: 'New Today',
                color: colors.green,
              },
              {
                value: String(thisMonth),
                label: 'This Month',
                color: colors.pink,
              },
            ]
          : [
              {
                value: String(totalTickets),
                label: 'Total Tickets',
                color: colors.red,
              },
              {
                value: String(pendingCount),
                label: 'Pending',
                color: colors.pink,
              },
              {
                value: String(inProgressCount),
                label: 'In Progress',
                color: colors.green,
              },
              {
                value: String(resolvedCount),
                label: 'Resolved',
                color: colors.orange,
              },
            ]
        ).map((c, i) => (
          <View key={i} style={[styles.card, { borderColor: c.color }]}>
            <Text style={[styles.cardValue, { color: c.color }]}>
              {c.value}
            </Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <Text style={styles.searchHeading}>Search</Text>
      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Search customers or tickets…"
          placeholderTextColor={colors.textSecondary}
        />
        <AntDesign
          name="search1"
          size={18}
          color={colors.textPrimary}
          style={styles.searchIcon}
        />
      </View>

      {/* Tickets filters */}
      {activeTab === 'Tickets & Communication' && (
        <View style={styles.filterRow}>
          <Dropdown
            open={showStatus}
            setOpen={setShowStatus}
            value={status}
            setValue={setStatus}
            items={[
              'All Status',
              'Pending',
              'In Progress',
              'Closed',
              'Resolved',
            ]}
          />
          <Dropdown
            open={showCat}
            setOpen={setShowCat}
            value={category}
            setValue={setCategory}
            items={catOptions}
          />
          <View style={{ width: 10 }} />
        </View>
      )}

      {/* Header */}
      <View style={styles.headerRow}>
        {columns?.map(col => (
          <Text key={col.key} style={[styles.headerText, { flex: col.flex }]}>
            {col.title}
          </Text>
        ))}
        <Text style={[styles.headerText, { width: 64, textAlign: 'right' }]}>
          Actions
        </Text>
      </View>

      {activeTab === 'Tickets & Communication' ? (
        <FlatList
          data={data}
          keyExtractor={it => String(it.id)}
          renderItem={renderTicketRow}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={() => tHasMore && fetchTickets(false)}
          ListFooterComponent={
            tLoading ? (
              <ActivityIndicator
                style={{ marginVertical: 12 }}
                color={colors.accentGold}
              />
            ) : null
          }
          refreshing={tRefreshing}
          onRefresh={() => {
            setTRefreshing(true);
            setTHasMore(true);
            setTPage(1);
            fetchTickets(true);
          }}
          ListEmptyComponent={
            !tLoading && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 80,
                }}
              >
                <Feather name="inbox" size={70} color={colors.textSecondary} />
                <Text
                  style={{
                    marginTop: 14,
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.textSecondary,
                  }}
                >
                  No Tickets or Communication Found
                </Text>
                <Text
                  style={{
                    color: colors.textLight,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Try refreshing or creating a new ticket.
                </Text>
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={it => String(it.id)}
          renderItem={renderRow}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={() => hasMore && fetchCustomers(false)}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                style={{ marginVertical: 12 }}
                color={colors.accentGold}
              />
            ) : null
          }
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setHasMore(true);
            setPage(1);
            fetchCustomers(true);
          }}
          ListEmptyComponent={
            !loading && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 80,
                }}
              >
                <Feather name="users" size={70} color={colors.textSecondary} />
                <Text
                  style={{
                    marginTop: 14,
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.textSecondary,
                  }}
                >
                  No Customers Found
                </Text>
                <Text
                  style={{
                    color: colors.textLight,
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  Try refreshing or adding a new customer.
                </Text>
              </View>
            )
          }
        />
      )}
      {/* FAB add (customers only) */}
      {activeTab === 'Customer Management' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CustomerForm', { type: 'add' })}
        >
          <Icon name="add" size={32} color="#000" />
        </TouchableOpacity>
      )}

      {/* Delete Confirm */}
      <Modal visible={!!deleteId} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18 }}
          >
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>
              Delete Customer?
            </Text>
            <Text style={{ color: '#555', marginBottom: 16 }}>
              Are you sure you want to delete this customer?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setDeleteId(null)}
                style={{
                  backgroundColor: '#eee',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: '600', color: '#222' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                style={{
                  backgroundColor: '#c62828',
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontWeight: '600', color: '#fff' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AgentHome;

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabsWrap: { paddingHorizontal: 16, marginTop: 8 },
  tabsGroup: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabActive: { backgroundColor: colors.accentGold },
  tabInactive: { backgroundColor: '#FFFFFF' },
  tabText: {
    fontWeight: '600',
    color: colors.cardBg,
    fontSize: 14,
    textAlign: 'center',
  },
  tabTextActive: { color: colors.textPrimary },
  firstTab: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  lastTab: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 14,
  },
  card: {
    width: widthPercentageToDP(46),
    backgroundColor: colors.cardBg,
    borderWidth: 0.2,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  cardValue: { fontSize: 26, fontWeight: '800' },
  cardLabel: {
    marginTop: 6,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 15,
  },
  searchHeading: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  searchWrap: {
    marginHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.textSecondary,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    color: colors.textPrimary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingRight: 36,
  },
  searchIcon: { position: 'absolute', right: 12, top: 13 },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
  },
  ddTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.textPrimary,
  },
  ddTriggerText: { color: colors.textPrimary, fontWeight: '600' },
  menu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    paddingVertical: 6,
    zIndex: 20,
  },
  menuItem: { paddingVertical: 8, paddingHorizontal: 12 },
  menuText: { color: '#000', fontWeight: '500' },
  menuDivider: { height: 1, backgroundColor: colors.border, opacity: 0.6 },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  headerText: { color: colors.textPrimary, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  cell: { color: colors.textPrimary },
  actionBtn: { width: 64, alignItems: 'flex-end' },
  fab: {
    width: widthPercentageToDP(14),
    height: heightPercentageToDP(6.5),
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
});
