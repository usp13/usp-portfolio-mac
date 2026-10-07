import { useState, useEffect } from 'react';

interface BatteryStatus {
  level: number;
  charging: boolean;
  chargingTime: number | null;
  dischargingTime: number | null;
  supported: boolean;
}

interface BatteryManager {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
  onchargingchange?: (() => void) | null;
  onlevelchange?: (() => void) | null;
  onchargingtimechange?: (() => void) | null;
  ondischargingtimechange?: (() => void) | null;
}

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }
}

const useBatteryStatus = (): BatteryStatus => {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus>({
    level: 100,
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });

  useEffect(() => {
    let battery: BatteryManager | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const updateBatteryStatus = () => {
      if (battery) {
        setBatteryStatus({
          level: Math.round(battery.level * 100),
          charging: Boolean(battery.charging),
          chargingTime: battery.chargingTime === Infinity ? null : battery.chargingTime,
          dischargingTime: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
          supported: true,
        });
      }
    };

    const initBattery = async () => {
      try {
        if ('getBattery' in navigator && typeof navigator.getBattery === 'function') {
          battery = await navigator.getBattery();
          updateBatteryStatus();

          // Listen for desktop power connection changes
          battery.addEventListener('chargingchange', updateBatteryStatus);
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('chargingtimechange', updateBatteryStatus);
          battery.addEventListener('dischargingtimechange', updateBatteryStatus);

          // Direct property handlers for robust cross-browser execution
          battery.onchargingchange = updateBatteryStatus;
          battery.onlevelchange = updateBatteryStatus;

          // Regular fallback check every 4 seconds
          pollInterval = setInterval(updateBatteryStatus, 4000);
        } else {
          setBatteryStatus(prevStatus => ({
            ...prevStatus,
            supported: false,
          }));
        }
      } catch (error) {
        console.warn('Battery Status API not supported or access denied:', error);
        setBatteryStatus(prevStatus => ({
          ...prevStatus,
          supported: false,
        }));
      }
    };

    initBattery();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (battery) {
        battery.removeEventListener('chargingchange', updateBatteryStatus);
        battery.removeEventListener('levelchange', updateBatteryStatus);
        battery.removeEventListener('chargingtimechange', updateBatteryStatus);
        battery.removeEventListener('dischargingtimechange', updateBatteryStatus);
        battery.onchargingchange = null;
        battery.onlevelchange = null;
      }
    };
  }, []);

  return batteryStatus;
};

export default useBatteryStatus;
