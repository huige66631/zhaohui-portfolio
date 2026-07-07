ALTER TABLE visitor_devices ADD COLUMN device_fingerprint TEXT;
CREATE INDEX IF NOT EXISTS idx_visitor_devices_device_fingerprint
  ON visitor_devices(device_fingerprint);
