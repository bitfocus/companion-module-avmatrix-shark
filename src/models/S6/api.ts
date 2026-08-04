import type ModuleInstance from '../../main.js'
import { type BaseDeviceApi } from '../types.js'

export class S6Api implements BaseDeviceApi {
	instance: ModuleInstance
	constructor(self: ModuleInstance) {
		this.instance = self
	}

	url(): string {
		return `http://${this.instance.config.host}:${this.instance.config.port}`
	}

	async connect(): Promise<void> {}

	async disconnect(): Promise<void> {}
}
