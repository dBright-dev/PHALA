import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  useColorScheme, 
  FlatList,
  Dimensions
} from 'react-native';
import { Colors } from '../../constants/theme';
import { THABIS_MENU } from '../../constants/MenuData';
import { useRouter } from 'expo-router';
import { LayoutGrid, Sandwich, Flame, Pizza, Cake, ChevronRight } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryMeta {
  name: 'Kota' | 'Burgers' | 'Boerewors' | 'Chips & Wings' | 'Sides & Desserts';
  icon: React.ReactNode;
  count: number;
  highlight: string;
}

export default function MenuCatalogScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const router = useRouter();

  // 1. Calculate how many active items exist in each category dynamically
  const getCount = (cat: string) => THABIS_MENU.filter(item => item.category === cat).length;

  // 2. Define structured visual metadata for our local categories
  const CATALOG_CATEGORIES: CategoryMeta[] = [
    { 
      name: 'Kota', 
      icon: <LayoutGrid size={24} color="#FF7600" />, 
      count: getCount('Kota'),
      highlight: 'Phala 1 to Phala\'ment' 
    },
    { 
      name: 'Burgers', 
      icon: <Sandwich size={24} color="#FF7600" />, 
      count: getCount('Burgers'),
      highlight: 'Dagwoods & Cheese Burgers' 
    },
    { 
      name: 'Boerewors', 
      icon: <Flame size={24} color="#FF7600" />, 
      count: getCount('Boerewors'),
      highlight: 'Traditional Flame-Grilled' 
    },
    { 
      name: 'Chips & Wings', 
      icon: <Pizza size={24} color="#FF7600" />, 
      count: getCount('Chips & Wings'),
      highlight: 'Slaptjips & Sticky Wings' 
    },
    { 
      name: 'Sides & Desserts', 
      icon: <Cake size={24} color="#FF7600" />, 
      count: getCount('Sides & Desserts'),
      highlight: 'Magwinya & Cinnamon Pancakes' 
    },
  ];

  const handleCategoryPress = (categoryName: string) => {
    // Navigate back to the home index feed and pass the category name as a local routing parameter
    router.push({
      pathname: '/(tabs)',
      params: { autoSelectCategory: categoryName }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Explore Categories</Text>
        <Text style={styles.headerSubtitle}>Select a kitchen section to filter Thabi's premium menu</Text>
      </View>

      {/* CATEGORIES COLLECTION LIST */}
      <FlatList
        data={CATALOG_CATEGORIES}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.catalogCard, { backgroundColor: '#161618', borderColor: '#262629' }]}
            onPress={() => handleCategoryPress(item.name)}
            activeOpacity={0.7}
          >
            {/* Left Content Area */}
            <View style={styles.iconWrapper}>
              {item.icon}
            </View>

            <View style={styles.textWrapper}>
              <View style={styles.titleRow}>
                <Text style={[styles.categoryName, { color: activeColors.text }]}>{item.name}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.count} Items</Text>
                </View>
              </View>
              <Text style={styles.categoryHighlight} numberOfLines={1}>{item.highlight}</Text>
            </View>

            {/* Right Action Indicator */}
            <ChevronRight size={20} color="#48484A" style={styles.chevron} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingTop: 20, marginBottom: 8 },
  headerTitle: { fontSize: 25, fontWeight: '900', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  
  // Custom Catalog Layout Components
  listContainer: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  catalogCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 22, 
    borderWidth: 1,
    position: 'relative'
  },
  iconWrapper: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: '#1C1C1E', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  textWrapper: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  categoryName: { fontSize: 16, fontWeight: '800' },
  countBadge: { backgroundColor: '#262629', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  countText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  categoryHighlight: { fontSize: 12, color: '#8E8E93' },
  chevron: { marginLeft: 8 }
});