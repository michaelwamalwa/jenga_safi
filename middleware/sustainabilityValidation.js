// middleware/sustainabilityValidation.js
import { z } from 'zod';

const sensorSchema = z.object({
  deviceId: z.string().length(12),
  timestamp: z.date(),
  metrics: z.object({
    carbon_kg: z.number().min(0),
    energy_kwh: z.number().min(0),
    water_liters: z.number().min(0),
    waste_kg: z.number().min(0)
  })
});

export function validateSensorData(data) {
  try {
    return sensorSchema.parse(data);
  } catch (err) {
    console.error('Validation failed:', err);
    throw new Error('Invalid sensor data');
  }
}