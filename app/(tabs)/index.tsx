import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  useColorScheme, 
  ScrollView,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { Colors } from '../../constants/theme';
import { THABIS_MENU, MenuItem } from '../../constants/MenuData';
import { useCart } from '../../context/CartContext';
import { Flame, Clock, Search, SlidersHorizontal, Sparkles } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_HEIGHT = 260; // Clean, high-impact height for food imagery

type CategoryType = 'All' | 'Kota' | 'Burgers' | 'Boerewors' | 'Chips & Wings' | 'Sides & Desserts';

// Structured assets for the hero banner slideshow mapping your exact menu documentation files
// Updated asset schema pointing directly to all 6 of your menu image assets
const SLIDESHOW_IMAGES = [
  { id: '1', source: require('./assets/images/phala.png'), title: 'Premium Loaded Kotas' },
  { id: '2', source: require('./assets/images/dagwood.png'), title: 'Triple-Decker Dagwoods' },
  { id: '3', source: require('./assets/images/wings_chips.png'), title: 'Golden Slaptjips & Wings' },
  { id: '5', source: require('./assets/images/magwinya.png'), title: 'Fresh Traditional Magwinya' },
  { id: '6', source: require('./assets/images/boerwors_roll.png'), title: 'Flame-Grilled Boerewors Rolls' }
];

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'dark'];
  const { addToCart } = useCart();
  const params = useLocalSearchParams<{ autoSelectCategory?: CategoryType }>();
  
  // App state managers
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const [isWednesday, setIsWednesday] = useState(false);

  // Slideshow precise alignment hooks
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const categories: CategoryType[] = ['All', 'Kota', 'Burgers', 'Boerewors', 'Chips & Wings', 'Sides & Desserts'];

  // Sync category state if redirected from the catalog view
  useEffect(() => {
    if (params?.autoSelectCategory) {
      setSelectedCategory(params.autoSelectCategory);
    }
  }, [params?.autoSelectCategory]);

  // Calendar validation hook for Wednesday promos
  useEffect(() => {
    const today = new Date();
    setIsWednesday(today.getDay() === 3);
  }, []);

  const handleNoteChange = (itemId: string, text: string) => {
    setItemNotes(prev => ({ ...prev, [itemId]: text }));
  };

  // Filter pipeline logic
  const filteredMenu = THABIS_MENU.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Master Render Header containing Slideshow and Live Mid-week Promos
  const renderHeaderLayout = () => (
    <View style={{ backgroundColor: activeColors.background }}>
      
      {/* 1. BRAND HERO BANNER SLIDESHOW */}
      <View style={styles.slideshowWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x) / SCREEN_WIDTH;
            setActiveSlideIndex(newIndex);
          }}
          scrollEventThrottle={16}
        >
          {SLIDESHOW_IMAGES.map((slide) => (
            <View key={slide.id} style={styles.slideCard}>
              <Image source={slide.source} style={styles.slideImage} resizeMode="cover" />
              <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideSubtitle}>Freshly Flame-Grilled To Order</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDESHOW_IMAGES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                activeSlideIndex === index ? { backgroundColor: '#FF7600', width: 18 } : { backgroundColor: 'rgba(255,255,255,0.4)' }
              ]} 
            />
          ))}
        </View>
      </View>

      {/* 2. DYNAMIC LIVE WEDNESDAY PROMO BANNER */}
      {isWednesday && (
        <View style={styles.wednesdayPromoBanner}>
          <View style={styles.promoHeaderRow}>
            <View style={styles.promoTag}>
              <Sparkles size={14} color="#FFF" />
              <Text style={styles.promoTagText}>WEDNESDAY EXCLUSIVE DEAL</Text>
            </View>
            <Text style={styles.promoPrice}>R75</Text>
          </View>
          <Text style={styles.promoTitle}>4 Hot/Full Sticky Wings & Chips</Text>
          <Text style={styles.promoBody}>Mid-week cravings sorted! Get 4 succulent flame-glazed sticky wings paired with our signature golden slaptjips right now.</Text>
          <TouchableOpacity 
            style={styles.promoActionBtn}
            onPress={() => {
              const wingsItem = THABIS_MENU.find(i => i.id === 'sticky-wings-chips');
              if (wingsItem) addToCart({ ...wingsItem, image: undefined }, 1, 'Wednesday Promo Order');
            }}
          >
            <Flame size={16} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.promoActionText}>Claim Deal Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. BUSINESS BRAND IDENTIFIER */}
      <View style={styles.headerTitleContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>Thabang Food</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Open</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Premium local flame-grilled street food flavors</Text>
      </View>

      {/* 4. SEARCH CONTROLS */}
      <View style={styles.searchBarRow}>
        <View style={styles.searchBoxWrapper}>
          <Search size={18} color="#727274" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search kota, burgers, boerewors..."
            placeholderTextColor="#727274"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity style={styles.filterSettingBtn}>
          <SlidersHorizontal size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* 5. CATEGORY HORIZONTAL FILTER PILLS */}
      <View style={{ maxHeight: 50, marginBottom: 12 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                { backgroundColor: '#161618', borderColor: '#262629' },
                selectedCategory === cat && { backgroundColor: activeColors.primary, borderColor: activeColors.primary }
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryPillText, { color: '#8E8E93' }, selectedCategory === cat && { color: '#FFF' }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeaderLayout} // Moves slideshow cleanly into uniform scroll structure
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const currentNote = itemNotes[item.id] || '';
          
          return (
            <View style={[styles.menuItemCard, { backgroundColor: '#161618', borderColor: '#262629' }]}>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.itemName, { color: activeColors.text }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: '#FF7600' }]}>R{item.price}</Text>
                </View>
                
                <Text style={styles.itemDescription}>{item.description}</Text>

                {item.ingredients && (
                  <Text style={styles.ingredientsLine}>
                    Includes: <Text style={{ color: '#8E8E93' }}>{item.ingredients.join(', ')}</Text>
                  </Text>
                )}
                
                {item.availability && (
                  <View style={styles.itemAlertTag}>
                    <Clock size={12} color="#FF7600" />
                    <Text style={styles.itemAlertTagText}>{item.availability}</Text>
                  </View>
                )}

                <TextInput
                  style={styles.noteInput}
                  placeholder="Add custom instructions (e.g., No atchar, extra sauce...)"
                  placeholderTextColor="#48484A"
                  value={currentNote}
                  onChangeText={(text) => handleNoteChange(item.id, text)}
                />

                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: activeColors.primary }]}
                  onPress={() => {
                    addToCart({ ...item, image: undefined }, 1, currentNote);
                    handleNoteChange(item.id, '');
                  }}
                >
                  <Flame size={14} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.addButtonText}>Add to Basket</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Enhanced, Clean-fitted Slideshow Layout Architecture
  slideshowWrapper: { 
    width: SCREEN_WIDTH, 
    height: SLIDE_HEIGHT, 
    position: 'relative',
    backgroundColor: '#000' 
  },
  slideCard: { 
    width: SCREEN_WIDTH, 
    height: SLIDE_HEIGHT,
    overflow: 'hidden'
  },
  slideImage: { 
    width: SCREEN_WIDTH, 
    height: SLIDE_HEIGHT
  },
  slideOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(0,0,0,0.65)', 
    padding: 16, 
    paddingTop: 40 
  },
  slideTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: -0.4 },
  slideSubtitle: { color: '#FF7600', fontSize: 11, fontWeight: '800', marginTop: 3, letterSpacing: 0.5, textTransform: 'uppercase' },
  paginationRow: { position: 'absolute', bottom: 14, right: 16, flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 6, borderRadius: 3, width: 6 },

  // Live Smart Wednesday Promo Styles
  wednesdayPromoBanner: { backgroundColor: '#FF7600', margin: 16, borderRadius: 20, padding: 18, elevation: 4 },
  promoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  promoTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  promoTagText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  promoPrice: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  promoTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  promoBody: { color: 'rgba(255,255,255,0.85)', fontSize: 12, lineHeight: 16, marginTop: 4, marginBottom: 14 },
  promoActionBtn: { backgroundColor: '#FFF', alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  promoActionText: { color: '#000', fontSize: 13, fontWeight: '900' },

  // Brand Identifier Headers
  headerTitleContainer: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 25, fontWeight: '900', letterSpacing: -0.5 },
  badge: { backgroundColor: '#243325', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#34C759' },
  badgeText: { color: '#34C759', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  headerSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  
  // Search Bar Layout Configuration
  searchBarRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16, alignItems: 'center' },
  searchBoxWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#161618', borderWidth: 1, borderColor: '#262629', borderRadius: 14, height: 46, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 14 },
  filterSettingBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FF7600', justifyContent: 'center', alignItems: 'center' },

  // Horizontal Scroller
  categoryContainer: { paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 40 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  categoryPillText: { fontSize: 13, fontWeight: '700' },
  
  // Feed Layout & Product Display Cards
  menuList: { paddingBottom: 30 },
  menuItemCard: { padding: 18, borderRadius: 24, borderWidth: 1, flexDirection: 'row', marginHorizontal: 16, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  itemName: { fontSize: 16, fontWeight: '800' },
  itemPrice: { fontSize: 16, fontWeight: '900' },
  itemDescription: { fontSize: 12, color: '#8E8E93', lineHeight: 16, marginBottom: 8 },
  ingredientsLine: { fontSize: 11, fontWeight: '700', color: '#FF7600', marginBottom: 10 },
  itemAlertTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  itemAlertTagText: { fontSize: 11, color: '#FF7600', fontWeight: '700' },
  
  // Custom Controls Inputs
  noteInput: { backgroundColor: '#0D0D0E', borderRadius: 10, borderWidth: 1, borderColor: '#262629', height: 40, paddingHorizontal: 12, fontSize: 12, color: '#FFF', marginBottom: 12 },
  addButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addButtonText: { color: '#FFF', fontSize: 12, fontWeight: '800' }
});