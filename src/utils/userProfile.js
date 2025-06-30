// User profile utility for localStorage

const PROFILE_KEY = 'wouldYouRatherProfile';

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (e) {
    console.error('Error saving user profile:', e);
    return false;
  }
}

export function getUserProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading user profile:', e);
    return null;
  }
}

export function clearUserProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing user profile:', e);
    return false;
  }
} 