import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type Secrets } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import type { DeviceModel } from './models/types.js'
import { Models } from './models/index.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: Secrets
	actions: any
	feedbacks: any
	variables: any
}

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig // Setup in init()
	secrets!: Secrets // Setup in init()
	model!: DeviceModel
	tbarAni: any
	volAni: any

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: Secrets): Promise<void> {
		try {
			this.config = config
			this.secrets = secrets
			this.updateStatus(InstanceStatus.Disconnected)
			this.model = Models[config.model](this)

			if (!this.model) {
				throw new Error(`Unsupported model ${config.model}`)
			}

			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updatePresets() // export Presets
			this.updateVariableDefinitions() // export variable definitions
			void this.model.api.connect()
		} catch (e: any) {
			this.log('error', e)
		}
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		this.updateStatus(InstanceStatus.Disconnected)
		void this.model.api.disconnect()
	}

	async configUpdated(config: ModuleConfig, secrets: Secrets): Promise<void> {
		await this.init(config, false, secrets)
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		this.setActionDefinitions(this.model.getActionsDefinitions(this))
	}

	updateFeedbacks(): void {
		this.setFeedbackDefinitions(this.model.getFeedbacksDefinitions(this))
	}

	updatePresets(): void {
		const [structure, presets] = this.model.getPresetsDefinitions(this)
		this.setPresetDefinitions(structure, presets)
	}

	updateVariableDefinitions(): void {
		this.setVariableDefinitions(this.model.getVariableDefinitions(this))
	}
}
