"use client"

import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { CheckCircle, AlertCircle, Camera } from 'lucide-react'

export default function QRScanner({ onScan, onError }) {
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        'qr-scanner',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      scanner.render(
        (decodedText) => {
          setScanResult(decodedText)
          onScan(decodedText)
          scanner.clear()
          setIsScanning(false)
        },
        (error) => {
          console.error('QR scan error:', error)
        }
      )

      scannerRef.current = scanner

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear()
        }
      }
    }
  }, [isScanning, onScan])

  const startScanning = () => {
    setIsScanning(true)
    setScanResult(null)
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
    }
    setIsScanning(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Scanner</h3>
          <p className="text-gray-600">Scan the event QR code to check in</p>
        </div>

        {!isScanning && !scanResult && (
          <button
            onClick={startScanning}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Scanning
          </button>
        )}

        {isScanning && (
          <div>
            <div id="qr-scanner" className="mb-4"></div>
            <button
              onClick={stopScanning}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}

        {scanResult && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 font-medium">Successfully scanned!</p>
            </div>
            <p className="text-sm text-green-700 mt-1">Processing check-in...</p>
          </div>
        )}
      </div>
    </div>
  )
}