import ky from 'ky'
import urljoin from 'url-join'

import { DeviceInfo } from './typings'

export class Device {
  private headers: { 'Content-Type': string; Cookie: string }

  private baseUrl: string

  deviceUuid: string

  gatewayUuid: string

  deviceName: string

  brightness: number

  colortemperature: number

  onoff: number

  signalQuality: number

  signalValue: number

  activeHours: number

  isOnline: number

  power: string

  onCount: number

  powerConsumptionTime: string

  productCode: string

  attributeIds: string

  rgbColorR: number

  rgbColorG: number

  rgbColorB: number

  constructor(
    {
      deviceUuid,
      gatewayUuid,
      deviceName,
      brightness,
      colortemperature,
      onoff,
      signalQuality,
      signalValue,
      activeHours,
      isOnline,
      power,
      onCount,
      powerConsumptionTime,
      productCode,
      attributeIds,
      rgbColorR,
      rgbColorG,
      rgbColorB
    }: DeviceInfo,
    jsessionid: string
  ) {
    this.deviceUuid = deviceUuid
    this.gatewayUuid = gatewayUuid
    this.deviceName = deviceName
    this.brightness = brightness
    this.colortemperature = colortemperature
    this.onoff = onoff
    this.signalQuality = signalQuality
    this.signalValue = signalValue
    this.activeHours = activeHours
    this.isOnline = isOnline
    this.power = power
    this.onCount = onCount
    this.powerConsumptionTime = powerConsumptionTime
    this.productCode = productCode
    this.attributeIds = attributeIds
    this.rgbColorR = rgbColorR
    this.rgbColorG = rgbColorG
    this.rgbColorB = rgbColorB
    this.baseUrl = 'https://us-elements.cloud.sengled.com:443/zigbee'

    this.headers = {
      'Content-Type': 'application/json',
      Cookie: `JSESSIONID=${jsessionid}`
    }
  }

  /**
   * Toggle device power state
   */
  public async toggle() {
    return this.brightness === 0 ? await this.on() : await this.off()
  }

  public on = async () => await this.setBrightness(100) as string;
  public off = async () => await this.setBrightness(0) as string;

  /**
   * Sets device brightneess between 1-100
   * @param brightness new device brightness
   */
  public async setBrightness(brightness: number) {
    const convertedBrightness = (brightness / 100) * 255

    const resp: any = (
      await ky.post(urljoin(this.baseUrl, '/device/deviceSetBrightness.json'), {
        headers: this.headers,
        json: {
          deviceUuid: this.deviceUuid,
          brightness: convertedBrightness
        }
      }).json());

    return resp.info as string
  }
  
  /**
   * Sets device color temperature between 1-100
   * @param colorTemp new device color temperature
   */
  public async setColorTemperature(colorTemp: number) {
    const convertedColorTemp = (colorTemp / 100) * 255;

    const resp: any = (
      await ky.post(urljoin(this.baseUrl, '/device/deviceSetColorTemperature.json'), {
        headers: this.headers,
        json: {
          deviceUuid: this.deviceUuid,
          colorTemperature: convertedColorTemp
        }
      }).json());

    return resp.info as string
  }
}
