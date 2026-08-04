import type ModuleInstance from '../../main.js'
import type { DeviceModel } from '../types.js'
import { getActionsDefinitions } from './actions.js'
import { S8XApi } from './api.js'
import { getFeedbacksDefinitions } from './feedbacks.js'
import { getPresetsDefinitions } from './presets.js'
import { getVariableDefinitions } from './variables.js'

function createS8X(self: ModuleInstance): DeviceModel<S8XApi> {
	return {
		api: new S8XApi(self),
		getActionsDefinitions,
		getFeedbacksDefinitions,
		getPresetsDefinitions,
		getVariableDefinitions,
	}
}

export default createS8X
