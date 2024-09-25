import React from 'react';
import { Image, StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

// Design System Colors
const COLORS = {
  BACKGROUND: '#faf8f9',
  PRIMARY: '#f89736',
  SECONDARY: '#8940e5',
  TEXT: '#080a1b',
  CARD_BG: '#f9f3e8',
  BORDER: '#080a1b',
  GREY_TEXT: '#4B5563',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo_transparent.png')} // Replace with your logo
            style={styles.logo}
          />
          <ThemedText type="title" style={styles.title}>Pontos.Gratis</ThemedText>
          <ThemedText type="subtitle" style={{ color: COLORS.GREY_TEXT, textAlign: "left", alignSelf: "flex-start", marginTop: 30, }}>Bem vindo, Ruggero</ThemedText>
        </View>

        <View style={styles.balanceContainer}>
          <ThemedText type="subtitle" style={styles.balanceLabel}>Your Balance</ThemedText>
          <ThemedText type="title" style={styles.balanceAmount}>1000 PONTOS</ThemedText>
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionContainer}> */}
        {/*   <Link href="/scan" asChild> */}
        {/*     <TouchableOpacity style={styles.actionButton}> */}
        {/*       <ThemedText type="defaultSemiBold" style={styles.buttonText}>Scan Receipt</ThemedText> */}
        {/*     </TouchableOpacity> */}
        {/*   </Link> */}
        {/*   <Link href="/rewards" asChild> */}
        {/*     <TouchableOpacity style={styles.actionButton}> */}
        {/*       <ThemedText type="defaultSemiBold" style={styles.buttonText}>Redeem Rewards</ThemedText> */}
        {/*     </TouchableOpacity> */}
        {/*   </Link> */}
        {/* </View> */}

        <View style={styles.recentActivityContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
          {dummyActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <ThemedText type="default" style={styles.activityText}>
                {activity.description}
              </ThemedText>
              <ThemedText type="default" style={styles.activityDate}>
                {activity.date}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dummy Data for Recent Activities
const dummyActivities = [
  { description: 'You earned 50 PONTOS from SuperMarket A', date: 'Sept 9, 2024' },
  { description: 'You redeemed 100 PONTOS for Coffee at Cafe B', date: 'Sept 8, 2024' },
  { description: 'You earned 200 PONTOS from Store C', date: 'Sept 7, 2024' },
  { description: 'You redeemed 150 PONTOS for Groceries at Market D', date: 'Sept 6, 2024' },
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND, // seasalt for background
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 10,
    marginTop: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT, // rich black for text
    marginBottom: 5,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: COLORS.CARD_BG, // floral white for balance card
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER, // rich black border
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.GREY_TEXT, // muted grey for labels
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT, // rich black for balance
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY, // carrot-orange for action buttons
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.TEXT, // white text on buttons
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentActivityContainer: {
    padding: 20,
    backgroundColor: COLORS.CARD_BG, // floral white for recent activities
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER, // rich black border for recent activities
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT, // rich black for section titles
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  activityText: {
    fontSize: 16,
    color: COLORS.TEXT,
    flexShrink: 1, // Ensures the text will wrap within the container
  },
  activityDate: {
    fontSize: 14,
    color: COLORS.GREY_TEXT,
    marginLeft: 10, // Adds spacing between the date and description
  },
});

