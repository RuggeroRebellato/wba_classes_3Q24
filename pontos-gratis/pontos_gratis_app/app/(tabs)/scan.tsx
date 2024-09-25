import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { NeoButton, NeoCard, NeoHeader } from "@/components/NeoComponents";
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledCameraView = styled(CameraView)
const StyledSafeAreaView = styled(SafeAreaView)

const API_URL = 'http://192.168.1.123:3000/api/transact/nfce-e';
const { width, height } = Dimensions.get('window');


export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ data: url }: BarcodeScanningResult) => {
    setScanned(true);
    setIsProcessing(true);
    try {
      // Fetch the HTML content from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlContent = await response.text();

      // Send the HTML content to our API
      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nfceHtml: htmlContent,
          userId: 'cm0ws00jq000aclufh9wzstb9', // Hardcoded user ID for testing
        }),
      });

      const responseData = await apiResponse.json();

      if (apiResponse.ok && responseData.success) {
        setScanResult(`Receipt processed successfully!\nTokens earned: ${responseData.tokenAmount / 100}`);
      } else {
        setScanResult(`Error: ${responseData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      if (error instanceof Error) {
        setScanResult(`Error processing QR code: ${error.message}`);
      } else {
        setScanResult('Error processing QR code: An unknown error occurred');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setScanResult(null);
  };

  if (hasPermission === null) {
    return <NeoCard><StyledText className="text-center">Requesting camera permission</StyledText></NeoCard>;
  }
  if (hasPermission === false) {
    return <NeoCard><StyledText className="text-center">No access to camera</StyledText></NeoCard>;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-orange-400">
      <StyledView className="flex-1 relative bg-white">
        <StatusBar barStyle="dark-content" />
        <NeoHeader title="QR Code Scanner" />
        <StyledView className="flex-1">
          {!scanned && (
            <StyledCameraView
              className="flex-1"
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
          )}
          {isProcessing && (
            <StyledView
              className="absolute justify-center items-center bg-white bg-opacity-90"
              style={{
                top: 0,
                left: 0,
                width: width,
                height: height,
                zIndex: 1000,
              }}
            >
              <StyledView className="absolute inset-0 bg-white bg-opacity-65 justify-center items-center">
                <ActivityIndicator size="large" color="#FCD34D" />
                <StyledText className="text-black text-lg mt-2">Processing Receipt...</StyledText>
              </StyledView>
            </StyledView>
          )}
          {scanResult && (
            <StyledView
              className="flex justify-center items-center bg-white bg-opacity-90"
              style={{
                top: 0,
                left: 0,
                width: width,
                height: height,
                zIndex: 1000,
              }}
            >
              <NeoCard className="w-4/5 max-w-sm ">
                <StyledView className="items-center p-4">
                  <StyledText className="text-lg text-center mb-5">{scanResult}</StyledText>
                  <NeoButton title="Scan Another" onPress={handleRescan} />
                </StyledView>
              </NeoCard>
            </StyledView>
          )}
        </StyledView>
        <StyledView className="absolute bottom-16 left-0 right-0 p-4">
          <NeoButton
            title="Go back"
            onPress={() => router.back()}
          />
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
}

