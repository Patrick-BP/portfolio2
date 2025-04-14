import { Client, Databases } from 'react-native-appwrite';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID! ;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID! ;
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT) // Your API Endpoint 
  .setProject(APPWRITE_PROJECT_ID!); // Your project ID

const databases = new Databases(client);  