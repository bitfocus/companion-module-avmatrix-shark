# avmatrix-shark

Available commands in this module

- PVW
- PGM
- TBar
- Audio
- Key OnAir

## Getting Started / Configuration

To set up the module, navigate to the Companion configuration page and add the instance. You will need to configure the following settings to establish a connection with your device:

- **Device**: Select your specific device model from the dropdown menu.
- **Target IP**: Enter the IP address of the device you wish to control (e.g., `192.168.1.100`).
- **Target Port**: Enter the port number used for communication. The default port is `80`.
- **Username**: Enter the username for device authentication. The default is usually `admin`.
- **Password**: Enter the password for the device. This field is secured and will not be visible once saved.
  - _Note: The password is the same as the one used to log in to the device's Web interface._

Once configured, the module will attempt to connect to the device using the provided credentials.

## Troubleshooting

If you are experiencing connection issues, please check the following common causes:

- **Connection Failure / Timeout**:
  - Verify that the **Target IP** and **Target Port** are correct.
  - Ensure the device is powered on and connected to the same network as the Companion computer.
  - Check if any firewall or antivirus software is blocking the connection.

- **Authentication Failed (401 Error)**:
  - Double-check the **Username** and **Password** in the instance settings.
  - If you recently changed the device's password, make sure to update it here and save the configuration.

- **Variables Not Updating**:
  - If the connection status shows as OK but variables are not updating, try disabling and re-enabling the instance to force a reconnection.
