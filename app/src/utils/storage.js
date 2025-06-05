import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromStorage() {
  try {
    const list = await AsyncStorage.getItem("videoList");
    if (list) {
      return JSON.parse(list);
    }
  } catch (error) {
    console.error("Error retrieving data from storage:", error);
    return null;
  }
}

export async function saveToStorage(data) {
  try {
    await AsyncStorage.setItem("videoList", data);
  } catch (error) {
    console.error("Error saving data to storage:", error);
  }
}

export async function clearStorage() {
  try {
    await AsyncStorage.removeItem("videoList");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}
