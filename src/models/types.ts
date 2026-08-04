import type ModuleInstance from '../main.js'
import type {
	CompanionActionDefinitions,
	CompanionFeedbackDefinitions,
	CompanionVariableDefinitions,
	CompanionPresetSection,
	CompanionPresetDefinitions,
} from '@companion-module/base'

export interface BaseDeviceApi {
	connect(): Promise<void>
	disconnect(): Promise<void>
}

export interface DeviceModel<TApi extends BaseDeviceApi = BaseDeviceApi> {
	getActionsDefinitions(self: ModuleInstance): CompanionActionDefinitions
	getFeedbacksDefinitions(self: ModuleInstance): CompanionFeedbackDefinitions
	getPresetsDefinitions(self: ModuleInstance): [CompanionPresetSection[], CompanionPresetDefinitions]
	getVariableDefinitions(self: ModuleInstance): CompanionVariableDefinitions
	api: TApi
}
